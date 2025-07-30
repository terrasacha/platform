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
import { FaArrowLeft, FaEye, FaCheck, FaTimes, FaGavel } from "react-icons/fa";

// Mostrar si tiene asignado validador
// Tiempo restante para verificar
const statusColor = {
  PENDING: "bg-gray-500",
  APPROVED: "bg-terrasacha-success",
  REJECTED: "bg-terrasacha-danger",
  SELECTABLE: "bg-terrasacha-secondary2",
  DOC_UPLOADED: "bg-terrasacha-light",
  ELEGIBLE: "bg-terrasacha-primary",
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openChatOnLoad = queryParams.get("openChat") === "true";
  const chatTarget = queryParams.get("chatTarget"); // legal | validator
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const status = propertyData?.propertyInfo?.status;
    console.log("📌 propertyData actualizado:", propertyData);

    if (status === "APPROVED" || status === "REJECTED") {
      setCurrentStep(5); // ✅ Ahora el paso final es el 5
    } else if (status === "SELECTABLE") {
      setCurrentStep(4); // ✅ Ahora el estudio se activa solo si es "ELEGIBLE"
    } else if (status === "DOC_UPLOADED") {
      setCurrentStep(3); // ✅ Si los archivos están completos, pasa a Validación Legal
    } else if (isFormComplete) {
      setCurrentStep(2); // ✅ Si el formulario está completo, pasa a Subir Documentación
    } else {
      setCurrentStep(1); // ✅ Estado inicial
    }

    console.log("📌 Nuevo currentStep:", currentStep);
  }, [isFormComplete, propertyData, filesAreComplete, s3Loading]);

  const handleValidationComplete = () => {
    console.log("📌 ¡Los archivos están completos! Pasando al paso 3.");
    handleStepChange(3);

    if (propertyData?.propertyInfo?.status === "ELEGIBLE") {
      console.log("📌 Predio es elegible. Pasando al paso 4...");
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
      await handlePropertyData({ pID: id });
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
    console.log(`📌 Cambiando al paso ${step}`);
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

  if (!property) return null;
  if (!propertyData) return null;

  return (
    <S3ClientProvider>
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-earth to-terrasacha-light">
        <div className="container mx-auto px-4 py-6">
          {/* Header Navigation */}
          <div className="mb-8">
            <NewHeaderNavbar />
          </div>

          {/* Navigation Breadcrumb */}
          <div className="mb-6">
            {property.campaign ? (
              <button
                onClick={() =>
                  handleNavigation(`/campaign/${property.campaign.id}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-terrasacha-earth hover:bg-terrasacha-light text-terrasacha-secondary1 font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
              >
                <FaArrowLeft className="text-sm" />
                Regresar a la campaña
              </button>
            ) : (
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 px-4 py-2 bg-terrasacha-earth hover:bg-terrasacha-light text-terrasacha-secondary1 font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
              >
                <FaArrowLeft className="text-sm" />
                Volver
              </button>
            )}
          </div>

          {/* Property Header Card */}
          <div className="bg-white rounded-2xl shadow-terrasacha-2xl border border-terrasacha-light p-8 mb-8 relative">
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span
                className={`${statusColor[property.status]} text-white text-xs font-typographica font-bold px-4 py-2 rounded-lg shadow-terrasacha`}
              >
                {statusEs[property.status]}
              </span>
            </div>

            {/* Property Title */}
            <header className="mb-6">
              <h1 className="text-4xl font-typographica font-bold text-terrasacha-secondary1 mb-4">
                {property.name}
              </h1>
            </header>

            {/* Property Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-typographica font-semibold text-terrasacha-secondary1 mb-2">
                    Fecha de creación
                  </h3>
                  <p className="text-terrasacha-light font-typographica">
                    {new Date(property.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-typographica font-semibold text-terrasacha-secondary1 mb-2">
                    Área Total
                  </h3>
                  <p className="text-terrasacha-light font-typographica">
                    {propertyData.projectCadastralRecords.totalAreaFormatted}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className=" border-terrasacha-light pt-6">
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
              />
            </div>

            {/* Navigation Tabs */}
            <div className=" border-terrasacha-light pt-6 mt-6">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveSection("details")}
                  className={`px-6 py-3 font-typographica font-semibold rounded-lg transition-all duration-300 ${
                    activeSection === "details"
                      ? "bg-terrasacha-primary text-white shadow-terrasacha"
                      : "text-terrasacha-secondary1 hover:bg-terrasacha-light hover:text-terrasacha-secondary1"
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
              <div className="bg-white rounded-2xl shadow-terrasacha-xl border border-terrasacha-light p-6 mb-8">
                <h2 className="text-2xl font-typographica font-bold text-terrasacha-secondary1 mb-6 flex items-center gap-3">
                  <FaGavel className="text-terrasacha-secondary2" />
                  Acciones Legales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {canAssign && (
                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-terrasacha-success hover:bg-terrasacha-secondary2 text-white font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaCheck />
                      Asignar predio
                    </button>
                  )}
                  {canUnassign && (
                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-terrasacha-danger hover:bg-red-600 text-white font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                      onClick={() => handleToggleAssign(property)}
                    >
                      <FaTimes />
                      Desasignar predio
                    </button>
                  )}
                  {canValidate && (
                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                      onClick={() => setShowDocumentationModal(true)}
                    >
                      <FaEye />
                      Validar Predio
                    </button>
                  )}
                </div>
              </div>
            ) : null;
          })()}

          {/* Property Details Section */}
          <div className="bg-white rounded-2xl shadow-terrasacha-xl border border-terrasacha-light">
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
