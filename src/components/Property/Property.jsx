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
  PENDING: "text-terrasacha-secondary1", // Amarillo Tierra (#e8d79a) con texto Verde Bosques Nublados (#44482c)
  APPROVED: "text-white", // Verde Pradera (#849b50) con texto blanco
  REJECTED: "text-white", // Rojo con texto blanco
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

  // ✅ CORREGIDO: useEffect principal solo para verificación inicial del formulario
  useEffect(() => {
    console.log("📌 useEffect principal ejecutándose...");
    console.log("📌 propertyData:", propertyData ? "disponible" : "no disponible");
    console.log("📌 isFormComplete actual:", isFormComplete);

    if (!propertyData) {
      console.log("📌 No hay propertyData, esperando...");
      return;
    }

    // ✅ CORREGIDO: Verificar si el formulario ya estaba completo antes de la recarga
    const checkFormCompletionStatus = () => {
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

    // ✅ CORREGIDO: Verificar el estado real del formulario y actualizarlo si es necesario
    const actualFormComplete = checkFormCompletionStatus();
    console.log("📌 Estado real del formulario:", actualFormComplete);
    
    if (actualFormComplete && !isFormComplete) {
      console.log("📌 Actualizando isFormComplete a true");
      setIsFormComplete(true);
    }
    
    console.log("📌 useEffect principal completado");
  }, [propertyData]); // ✅ Solo se ejecuta cuando cambia propertyData

  const handleValidationComplete = async () => {
    console.log("📌 ¡Los archivos están completos! Pasando al paso 3.");
    
    // ✅ Refrescar los datos del predio para obtener el status actualizado
    try {
      await handlePropertyData({ pID: id });
      console.log("📌 Datos del predio refrescados");
    } catch (error) {
      console.error("❌ Error refrescando datos del predio:", error);
    }
    
    // ✅ El useEffect detectará el cambio de status y avanzará automáticamente
    setCurrentStep(3);
  };

  // 🔴 Callbacks para los modales del Timeline
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

  // ✅ CORREGIDO: Refrescar datos del predio cuando cambie el status
  useEffect(() => {
    if (propertyData?.propertyInfo?.status) {
      console.log("📌 Status del predio detectado:", propertyData.propertyInfo.status);
      // Refrescar los datos para asegurar que estén actualizados
      handlePropertyData({ pID: id });
    }
  }, [propertyData?.propertyInfo?.status, id]);

  // ✅ CORREGIDO: useEffect específico para manejar cambios en isFormComplete
  useEffect(() => {
    if (propertyData && isFormComplete !== undefined) {
      console.log("📌 isFormComplete cambió a:", isFormComplete);
      
      const status = propertyData?.propertyInfo?.status;
      let newStep = 1;
      
      if (status === "APPROVED" || status === "REJECTED") {
        newStep = 5;
      } else if (status === "SELECTABLE") {
        newStep = 4;
      } else if (status === "DOC_UPLOADED") {
        newStep = 3;
      } else if (status === "PENDING" && isFormComplete) {
        newStep = 2;
      } else if (isFormComplete) {
        newStep = 2;
      } else {
        newStep = 1;
      }
      
      console.log("📌 Recalculando paso basado en isFormComplete:", { status, isFormComplete, newStep });
      
      if (newStep !== currentStep) {
        setCurrentStep(newStep);
        console.log("📌 currentStep actualizado a:", newStep);
      }
    }
  }, [isFormComplete, propertyData, currentStep]);

  // ✅ CORREGIDO: useEffect para establecer el currentStep inicial cuando se carga la página
  useEffect(() => {
    if (propertyData && isFormComplete !== undefined) {
      console.log("📌 Estableciendo currentStep inicial...");
      
      const status = propertyData?.propertyInfo?.status;
      let initialStep = 1;
      
      if (status === "APPROVED" || status === "REJECTED") {
        initialStep = 5;
      } else if (status === "SELECTABLE") {
        initialStep = 4;
      } else if (status === "DOC_UPLOADED") {
        initialStep = 3;
      } else if (status === "PENDING" && isFormComplete) {
        initialStep = 2;
      } else if (isFormComplete) {
        initialStep = 2;
      } else {
        initialStep = 1;
      }
      
      console.log("📌 currentStep inicial calculado:", { status, isFormComplete, initialStep });
      
      if (initialStep !== currentStep) {
        setCurrentStep(initialStep);
        console.log("📌 currentStep inicial establecido a:", initialStep);
      }
    }
  }, [propertyData, isFormComplete]); // ✅ Solo se ejecuta cuando se cargan los datos iniciales

  // ✅ DEBUG: Monitorear cambios en currentStep
  useEffect(() => {
    console.log("📌 Property - currentStep cambió a:", currentStep);
  }, [currentStep]);

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

  const handleOpenDocumentationModal = () => {
    setShowDocumentationModal(true);
  };

  const handleCloseDocumentationModal = () => {
    setShowDocumentationModal(false);
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

          {/* Separador visual */}
          <div className="border-b border-terrasacha-light/20 mb-6 sm:mb-8 md:mb-10"></div>

          {/* Navigation Breadcrumb - Separado del header con espacio propio */}
          <div className="mb-8 sm:mb-10 md:mb-12 pt-4 sm:pt-6 md:pt-8">
            {property.campaign ? (
              <button
                onClick={() =>
                  handleNavigation(`/campaign/${property.campaign.id}`)
                }
                className="btn-terrasacha-warning font-typographica"
              >
                Regresar a la campaña
              </button>
            ) : (
              <a
                onClick={() => handleNavigation(`/constructor`)}
                className="btn-terrasacha-warning font-typographica"
              >
                Ir a mis predios
              </a>
            )}

            {/* 📌 Aquí está el contenedor donde agregaremos la línea de tiempo */}
            <div className="relative pt-3 px-4 mb-4 mt-4 border border-terrasacha-light rounded-lg shadow-terrasacha bg-white">
              <div className="row gy-2">
                <header className="d-flex justify-content-between">
                  <p className="fs-3 mb-0 font-typographica text-terrasacha-primary">{property.name}</p>
                </header>
                <section>
                  <p className="fs-6 mb-0 fw-bold font-typographica text-terrasacha-secondary1">Fecha de creación:</p>
                  <p className="fs-6 mb-0 font-typographica text-terrasacha-secondary2">{property.createdAt}</p>
                </section>
                <section>
                  <p className="fs-6 mb-0 fw-bold font-typographica text-terrasacha-secondary1">Área Total:</p>
                  <p className="fs-6 mb-0 font-typographica text-terrasacha-secondary2">
                    {propertyData.projectCadastralRecords.totalAreaFormatted}
                  </p>
                </section>
              </div>

          {/* Property Header Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-terrasacha-light/30 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-terrasacha-light/5 to-transparent opacity-50"></div>
            
            {/* Status Badge */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
              <span
                className={`${
                  statusColor[property.status]
                } absolute top-4 right-4 text-xs font-bold px-4 py-2 w-fit rounded-lg text-nowrap font-typographica shadow-terrasacha`}
                style={{
                  backgroundColor: property.status === 'PENDING' ? '#e8d79a' : // Amarillo Tierra
                                  property.status === 'APPROVED' ? '#849b50' : // Verde Pradera
                                  property.status === 'REJECTED' ? '#dc3545' : '#6e6c35', // Rojo o Verde Selva por defecto
                  color: property.status === 'PENDING' ? '#44482c' : 'white' // Verde Bosques Nublados para PENDING, blanco para otros
                }}
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
              {/* 📌 Línea de tiempo horizontal dentro del div */}
              <div className="mt-6">
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
            </div>

              <ul className="font-medium flex mt-4 pl-0 font-typographica">
                <li>
                  <a
                    href="#details"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("details");
                    }}
                    className={`${
                      activeSection === "details"
                        ? "text-terrasacha-primary border-t border-r border-l border-terrasacha-primary rounded-t-md bg-terrasacha-light bg-opacity-20"
                        : "text-terrasacha-secondary2 hover:text-terrasacha-primary"
                    } flex py-2 px-3 transition-colors duration-200`}
                    aria-current="page"
                  >
                    Detalles
                  </a>
                </li>
              </ul>
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
                      className="btn w-full font-typographica"
                      style={{
                        backgroundColor: '#849b50', // Verde Pradera
                        borderColor: '#849b50',
                        color: 'white'
                      }}
                      aria-label="Asignar predio"
                      tabIndex={0}
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaCheck className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">Asignar predio</span>
                      <span className="sm:hidden">Asignar</span>
                    </button>
                  )}
                  
                  {canUnassign && (
                    <button
                      className="btn w-full font-typographica"
                      style={{
                        backgroundColor: '#dc3545', // Rojo
                        borderColor: '#dc3545',
                        color: 'white'
                      }}
                      aria-label="Desasignar predio"
                      tabIndex={0}
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaTimes className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="hidden sm:inline">Desasignar predio</span>
                      <span className="sm:hidden">Desasignar</span>
                    </button>
                  )}
                  
                  {canValidate && (
                    <button
                      className="btn w-full font-typographica"
                      style={{
                        backgroundColor: '#6e6c35', // Verde Selva
                        borderColor: '#6e6c35',
                        color: 'white'
                      }}
                      aria-label="Ver Documentación"
                      tabIndex={0}
                      onClick={() => property && setShowDocumentationModal(true)}
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

      <ValidationModal
        isOpen={showValidationModal}
        onClose={handleCloseValidationModal}
        onValidationComplete={handleValidationComplete}
      />
      </div>
    </S3ClientProvider>
 
  );
}



