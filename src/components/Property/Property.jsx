import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  createNotification,
  updateProperty,
  updateVerification,
} from "graphql/mutations";

// Contexts
import { S3ClientProvider, useS3Client } from "context/s3ClientContext";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { getProperty } from "graphql/queries";
import PropertyDetails from "./PropertyDetails";
import { usePropertyData } from "context/PropertyDataContext";
import Timeline from "./Timeline";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { DocumentationModal } from "../Legal/LegalAdmon";
import { useAuth } from "context/AuthContext";
import { FaArrowLeft, FaEye, FaCheck, FaTimes, FaGavel, FaCalendarAlt, FaRulerCombined, FaTimesCircle } from "react-icons/fa";
import TerrasachaLogo from "components/common/TerrasachaLogo";
import ConstructorWorkflow from "./ConstructorWorkflow";
import ValidationModal from "./ValidationModal";

// Mostrar si tiene asignado validador
// Tiempo restante para verificar
const statusColor = {
  PENDING: "bg-gradient-to-r from-gray-500 to-gray-600",
  APPROVED: "bg-gradient-to-r from-terrasacha-success to-green-600",
  REJECTED: "bg-gradient-to-r from-terrasacha-danger to-red-600",
  SELECTABLE: "bg-gradient-to-r from-terrasacha-secondary2 to-yellow-600",
  DOC_UPLOADED: "bg-gradient-to-r from-terrasacha-light to-blue-500",
  ELEGIBLE: "bg-gradient-to-r from-terrasacha-primary to-blue-600",
};

const statusEs = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  NOT_SELECTABLE: "No seleccionable",
  SELECTABLE: "Elegible",
  DOC_UPLOADED: "Documentación Cargada",
  ELEGIBLE: "Elegible",
};

export default function Property() {
  const { id } = useParams();
  const { propertyData, handlePropertyData } = usePropertyData();
  const [property, setProperty] = useState(null);
  const [editable, setEditable] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("details");
  const [changedFields, setChangedFields] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [s3Files, setS3Files] = useState([]);
  const [filesAreComplete, setFilesAreComplete] = useState(false);
  const [s3Loading, setS3Loading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openChatOnLoad = queryParams.get("openChat") === "true";
  const chatTarget = queryParams.get("chatTarget"); // legal | validator
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConstructorWorkflowModal, setShowConstructorWorkflowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const status = propertyData?.propertyInfo?.status;

    // Verificar si el formulario ya estaba completo antes de la recarga
    const checkFormCompletionStatus = () => {
      if (!propertyData) return false;
      
      // Verificar si hay datos en los formularios principales con campos correctos
      const hasCadastralRecords = propertyData.projectCadastralRecords?.totalArea > 0;
      
      // Verificar ActualUseAndPotential con campos reales
      const actualUseData = propertyData.projectActualUseAndPotential;
      const hasActualUse = actualUseData && (
        actualUseData.D_actual_use?.length > 0 ||
        actualUseData.D_area_potrero ||
        actualUseData.D_especie_plantaciones1 ||
        actualUseData.D_ha_plantaciones1 ||
        actualUseData.D_especie_plantaciones2 ||
        actualUseData.D_ha_plantaciones2
      );
      
      // Verificar UseRestrictions con campos reales
      const useRestrictionsData = propertyData.projectUseRestrictions;
      const hasUseRestrictions = useRestrictionsData && (
        useRestrictionsData.restrictions ||
        useRestrictionsData.description ||
        useRestrictionsData.notes
      );
      
      // Verificar Ecosystem con campos reales
      const ecosystemData = propertyData.projectEcosystem;
      const hasEcosystem = ecosystemData && (
        ecosystemData.ecosystemType ||
        ecosystemData.description ||
        ecosystemData.notes
      );
      
      // Verificar GeneralAspects con campos reales
      const generalAspectsData = propertyData.projectGeneralAspects;
      const hasGeneralAspects = generalAspectsData && (
        generalAspectsData.description ||
        generalAspectsData.notes ||
        generalAspectsData.observations
      );
      
      // Verificar Relations con campos reales
      const relationsData = propertyData.projectRelations;
      const hasRelations = relationsData && (
        relationsData.description ||
        relationsData.notes ||
        relationsData.observations
      );
      
      // Si al menos 3 formularios tienen datos, consideramos que está completo
      const completedForms = [hasCadastralRecords, hasActualUse, hasUseRestrictions, hasEcosystem, hasGeneralAspects, hasRelations].filter(Boolean).length;
      
      return completedForms >= 3;
    };

    // Verificar el estado real del formulario
    const actualFormComplete = checkFormCompletionStatus();
    
    if (actualFormComplete && !isFormComplete) {
      setIsFormComplete(true);
    }

    if (status === "APPROVED" || status === "REJECTED") {
      setCurrentStep(5);
    } else if (status === "SELECTABLE") {
      setCurrentStep(4);
    } else if (status === "DOC_UPLOADED") {
      setCurrentStep(3);
    } else if (actualFormComplete || isFormComplete) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [isFormComplete, propertyData, filesAreComplete, s3Loading]);

  const handleValidationComplete = () => {
    handleStepChange(3);

    if (propertyData?.propertyInfo?.status === "ELEGIBLE") {
      setCurrentStep(4);
    }
  };

  useEffect(() => {
    /* const fetchUserGroups = async () => {
        try {
          const user = await Auth.currentAuthenticatedUser();
          const groups = user.signInUserSession.idToken.payload['cognito:groups'] || [''];
          setUserGroup(groups[0])
        } catch (error) {
          console.error('Error fetching user groups: ', error);
        }
      };

      fetchUserGroups(); */
    const fetchPropertyData = async () => {
      setIsLoading(true);
      try {
        await handlePropertyData({ pID: id });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "Tienes cambios sin guardar. ¿Seguro que deseas salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNavigation = (path) => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: "Cambios sin guardar",
        text: "Tienes cambios sin guardar. ¿Seguro que deseas salir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#849b50", // terrasacha-secondary2
        cancelButtonColor: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(path);
        }
      });
    } else {
      navigate(path);
    }
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: "Cambios sin guardar",
        text: "Tienes cambios sin guardar. ¿Seguro que deseas salir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#849b50", // terrasacha-secondary2
        cancelButtonColor: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1); // Go back to previous page
        }
      });
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleFieldChange = (field, value) => {
    setChangedFields((prev) => ({
      ...prev,
      [field]: true, // 🔴 Marca el campo como modificado
    }));
    setHasUnsavedChanges(true);
  };

  const isAuthor = async (id) => {
    try {
      const userLogged = await Auth.currentAuthenticatedUser();

      if (userLogged.attributes.sub === id) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchProperty = async () => {
    try {
      const data = await API.graphql(graphqlOperation(getProperty, { id }));

      setProperty(data.data.getProperty);
      const isAuthorResult = await isAuthor(data.data.getProperty.userID);

      setEditable(isAuthorResult && propertyData.propertyInfo.status === null);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };
  useEffect(() => {
    if (propertyData) {
      fetchProperty();
    }
  }, [propertyData]);

  useEffect(() => {
    if (propertyData && property) {
      setIsLoading(false);
    }
  }, [propertyData, property]);

  // --- Reutilización de handleToggleAssign de LegalAdmon.jsx ---
  const handleToggleAssign = async (property) => {
    const propertyFeature = property.propertyFeatures?.items.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );
    const propertyVerificationID = propertyFeature?.verifications?.items[0]?.id;

    if (property.userLegal !== null) {
      if (property.userLegalID === user.id) {
        // Desasignar
        try {
          await API.graphql(
            graphqlOperation(updateProperty, {
              input: {
                id: property.id,
                userLegalID: null,
              },
            })
          );

          const notificationData = {
            userOriginID: user.id,
            userID: property.userID,
            message: `El revisor legal ya no está asignado a tu predio '${property.name}'.`,
            type: "PROPERTY",
            resourceID: property.id,
            isRead: false,
          };

          await API.graphql(
            graphqlOperation(createNotification, { input: notificationData })
          );

          toast.success(`Predio desasignado`);
          fetchProperty();
        } catch (error) {
          toast.error("Error al actualizar el estado del predio");
        }
        return;
      } else {
        toast.error("El predio pertenece a otro legal");
        return;
      }
    }

    // Asignar
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: property.id,
            userLegalID: user.id,
          },
        })
      );

      if (propertyVerificationID) {
        await API.graphql(
          graphqlOperation(updateVerification, {
            input: {
              id: propertyVerificationID,
              userVerifierID: user.id,
            },
          })
        );
      }

      const notificationData = {
        userOriginID: user.id,
        userID: property.userID,
        message: `Se ha asignado un revisor legal a tu predio '${property.name}' para revisar la documentación.`,
        type: "PROPERTY",
        resourceID: property.id,
        isRead: false,
      };

      await API.graphql(
        graphqlOperation(createNotification, { input: notificationData })
      );

      toast.success(`Predio asignado`);
      fetchProperty();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
    }
  };

  const handleOpenValidationModal = () => {
    setShowValidationModal(true);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
  };

  const handleOpenConstructorWorkflow = () => {
    setShowConstructorWorkflowModal(true);
  };

  const handleCloseConstructorWorkflow = () => {
    setShowConstructorWorkflowModal(false);
  };

  // Componente de carga con el logo de Terrasacha
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-terrasacha-earth via-terrasacha-light to-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Logo principal con efecto de pulso */}
          <div className="animate-pulse-terrasacha">
            <TerrasachaLogo className="w-48 h-auto mx-auto mb-8 opacity-80" />
          </div>
          
          {/* Círculos concéntricos animados */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-terrasacha-primary/20 rounded-full animate-ping"></div>
            <div className="absolute w-48 h-48 border-4 border-terrasacha-secondary2/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-32 h-32 border-4 border-terrasacha-light/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        {/* Texto de carga */}
        <div className="mt-8">
          <h2 className="text-2xl font-typographica font-bold text-terrasacha-secondary1 mb-2">
            Cargando Predio
          </h2>
          <p className="text-terrasacha-light font-typographica text-lg">
            Obteniendo información...
          </p>
        </div>
        
        {/* Indicador de progreso animado */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-terrasacha-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-terrasacha-secondary2 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-terrasacha-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar componente de carga mientras esté cargando
  if (isLoading || !property || !propertyData) {
    return <LoadingSpinner />;
  }

  return (
    <S3ClientProvider>
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-earth via-terrasacha-light to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
          {/* Header Navigation */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <NewHeaderNavbar />
          </div>

          {/* Separador visual */}
          <div className="border-b border-terrasacha-light/20 mb-6 sm:mb-8 md:mb-10"></div>

          {/* Navigation Breadcrumb - Separado del header con espacio propio */}
          <div className="mb-8 sm:mb-10 md:mb-12 pt-4 sm:pt-6 md:pt-8">
            {property.campaign ? (
              <button
                onClick={() =>
                  handleNavigation(`/campaign/${property.campaign.id}`)
                }
                className="group inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-terrasacha-earth to-terrasacha-light hover:from-terrasacha-light hover:to-terrasacha-earth text-terrasacha-secondary1 font-typographica font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-terrasacha-light/20 text-sm sm:text-base md:text-lg"
              >
                <FaArrowLeft className="text-sm md:text-base group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline">Regresar a la campaña</span>
                <span className="sm:hidden">Campaña</span>
              </button>
            ) : (
              <button
                onClick={handleGoBack}
                className="group inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-terrasacha-earth to-terrasacha-light hover:from-terrasacha-light hover:to-terrasacha-earth text-terrasacha-secondary1 font-typographica font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-terrasacha-light/20 text-sm sm:text-base md:text-lg"
              >
                <FaArrowLeft className="text-sm md:text-base group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline">Volver</span>
                <span className="sm:hidden">←</span>
              </button>
            )}
          </div>

          {/* Property Header Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-terrasacha-light/30 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-terrasacha-light/5 to-transparent opacity-50"></div>
            
            {/* Status Badge */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
              <span
                className={`${statusColor[property.status]} text-white text-xs sm:text-sm font-typographica font-bold px-3 sm:px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-white/20`}
              >
                {statusEs[property.status]}
              </span>
            </div>

            {/* Property Title */}
            <header className="mb-6 relative z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-typographica font-bold text-transparent bg-clip-text bg-gradient-to-r from-terrasacha-secondary1 to-terrasacha-primary mb-4 leading-tight">
                {property.name}
              </h1>
            </header>

            {/* Property Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
              <div className="bg-gradient-to-r from-terrasacha-light/10 to-transparent rounded-2xl p-4 sm:p-6 border border-terrasacha-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-terrasacha-primary/10 rounded-xl">
                    <FaCalendarAlt className="text-terrasacha-primary text-lg" />
                  </div>
                  <h3 className="text-base sm:text-lg font-typographica font-semibold text-terrasacha-secondary1">
                    Fecha de creación
                  </h3>
                </div>
                <p className="text-terrasacha-light font-typographica text-sm sm:text-base pl-11">
                  {new Date(property.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-terrasacha-light/10 to-transparent rounded-2xl p-4 sm:p-6 border border-terrasacha-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-terrasacha-secondary2/10 rounded-xl">
                    <FaRulerCombined className="text-terrasacha-secondary2 text-lg" />
                  </div>
                  <h3 className="text-base sm:text-lg font-typographica font-semibold text-terrasacha-secondary1">
                    Área Total
                  </h3>
                </div>
                <p className="text-terrasacha-light font-typographica text-sm sm:text-base pl-11">
                  {propertyData.projectCadastralRecords.totalAreaFormatted}
                </p>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="border-t border-terrasacha-light/30 pt-6 relative z-10">
              <Timeline
                currentStep={currentStep}
                isFormComplete={isFormComplete}
                handleValidationComplete={handleValidationComplete}
                onStepChange={handleStepChange}
                propertyStatus={propertyData?.propertyInfo?.status}
                filesAreComplete={filesAreComplete}
                propertyId={propertyData?.propertyInfo?.id}
                userId={propertyData?.projectPostulant?.id}
                campaignOwnerId={propertyData?.propertyCampaign?.userId || ""}
                openChatOnLoad={openChatOnLoad}
                chatTarget={chatTarget}
                onOpenValidationModal={handleOpenValidationModal}
                onOpenConstructorWorkflow={handleOpenConstructorWorkflow}
              />
            </div>

            {/* Navigation Tabs */}
            <div className="border-t border-terrasacha-light/30 pt-6 mt-6 relative z-10">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveSection("details")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-typographica font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeSection === "details"
                      ? "bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 text-white shadow-lg transform scale-105"
                      : "text-terrasacha-secondary1 hover:bg-terrasacha-light/50 hover:text-terrasacha-secondary1 hover:scale-105"
                  }`}
                >
                  Detalles
                </button>
              </nav>
            </div>
          </div>

          {/* Legal Actions Section */}
          {user?.role === "legal" && (() => {
            const canAssign = property.userLegalID === null && property.status !== "REJECTED" && property.status !== "APPROVED";
            const canUnassign = property.userLegalID === user.id && property.status !== "REJECTED" && property.status !== "APPROVED";
            const canValidate = property.userLegalID === user.id && property.status !== "APPROVED";
            const showActions = canAssign || canUnassign || canValidate;

            return showActions ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-terrasacha-light/30 p-4 sm:p-6 mb-6 sm:mb-8 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-terrasacha-primary/5 via-transparent to-terrasacha-secondary2/5"></div>
                
                <h2 className="text-xl sm:text-2xl font-typographica font-bold text-terrasacha-secondary1 mb-4 sm:mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-terrasacha-secondary2/20 rounded-xl">
                    <FaGavel className="text-terrasacha-secondary2 text-lg sm:text-xl" />
                  </div>
                  Acciones Legales
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10">
                  {canAssign && (
                    <button
                      className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-terrasacha-success to-green-600 hover:from-green-600 hover:to-terrasacha-success text-white font-typographica font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaCheck className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">Asignar predio</span>
                      <span className="sm:hidden">Asignar</span>
                    </button>
                  )}
                  
                  {canUnassign && (
                    <button
                      className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-terrasacha-danger to-red-600 hover:from-red-600 hover:to-terrasacha-danger text-white font-typographica font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaTimes className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">Desasignar predio</span>
                      <span className="sm:hidden">Desasignar</span>
                    </button>
                  )}
                  
                  {canValidate && (
                    <button
                      className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 hover:from-terrasacha-secondary1 hover:to-terrasacha-primary text-white font-typographica font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
                      onClick={() => setShowDocumentationModal(true)}
                    >
                      <FaEye className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">Validar Predio</span>
                      <span className="sm:hidden">Validar</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null;
          })()}

          {/* Property Details Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-terrasacha-light/30 overflow-hidden">
            <PropertyDetails
              visible={activeSection === "details"}
              setHasUnsavedChanges={setHasUnsavedChanges}
              handleFieldChange={handleFieldChange}
              setIsFormComplete={setIsFormComplete}
              currentStep={currentStep}
            />
          </div>

          <ToastContainer />
        </div>
      </div>
      
      {/* ValidationModal - Renderizado por fuera del Timeline */}
      {showValidationModal && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleCloseValidationModal}
          onValidationComplete={handleValidationComplete}
        />
      )}

      {/* ConstructorWorkflow Modal - Renderizado por fuera del Timeline */}
      {showConstructorWorkflowModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={handleCloseConstructorWorkflow}
            ></div>

            {/* Modal content */}
            <div className="relative z-[10000] inline-block align-bottom bg-white/95 backdrop-blur-sm rounded-3xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full border border-terrasacha-light/30">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 border-0 rounded-t-3xl p-6 flex items-center justify-between">
                <h3 className="text-xl font-typographica font-bold text-white">
                  Flujo de Trabajo del Consultor
                </h3>
                <button
                  onClick={handleCloseConstructorWorkflow}
                  className="text-white hover:text-terrasacha-light transition-all duration-300 hover:scale-110 transform"
                  aria-label="Cerrar modal"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-gradient-to-br from-terrasacha-light/10 via-white to-terrasacha-earth/10">
                <ConstructorWorkflow propertyId={propertyData?.propertyInfo?.id} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <DocumentationModal
        isOpen={showDocumentationModal}
        onClose={() => setShowDocumentationModal(false)}
        property={property}
        fetchProperties={fetchProperty}
        user={user}
      />
    </S3ClientProvider>
  );
}



