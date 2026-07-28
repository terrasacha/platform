import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { useNavigate } from "react-router-dom";

// Contexts
import { getProperty } from "graphql/queries";
import { usePropertyData } from "context/PropertyDataContext";
import { useAuth } from "context/AuthContext";
import PropertyDetails from "./PropertyDetails";
import PropertyCatastral from "./PropertyCatastral";
import PropertyOwners from "./PropertyOwners";
import PropertyDocumentation from "./PropertyDocumentation";
import PropertyGeneral from "./PropertyGeneral";
import PropertyChat from "./PropertyChat";

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

const roleMapping = {
  constructor: "Postulante",
  admon: "Administrador",
  investor: "Inversor",
  validator: "Consultor",
  legal: "Revisor Legal",
  analyst: "Analista",
  admin: "Administrador",
  user: "Usuario",
};

export default function Property2() {
  const { id } = useParams();
  const { propertyData, handlePropertyData } = usePropertyData();
  const [property, setProperty] = useState(null);
  const [editable, setEditable] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("details");
  const [changedFields, setChangedFields] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [s3Files, setS3Files] = useState([]);
  const [filesAreComplete, setFilesAreComplete] = useState(false);
  const [s3Loading, setS3Loading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openChatOnLoad = queryParams.get("openChat") === "true";
  const chatTarget = queryParams.get("chatTarget"); // legal | validator
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showConstructorWorkflowModal, setShowConstructorWorkflowModal] =
    useState(false);
  const [activeTab, setActiveTab] = useState("estado");
  const { user } = useAuth();

  const handleUserSettings = () => {
    // Aquí puedes agregar la lógica para navegar a la configuración del usuario
    // Por ejemplo: navigate('/user-settings') o abrir un modal
    console.log("Ir a configuración de usuario");
  };

  const handleFieldChange = (field, value) => {
    setChangedFields((prev) => ({
      ...prev,
      [field]: true, // 🔴 Marca el campo como modificado
    }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    // Solo establecer loading como false cuando tengamos ambos datos
    if (propertyData && property) {
      setIsLoading(false);
    }
  }, [propertyData, property]);

  // Efecto para manejar la carga inicial de propertyData
  useEffect(() => {
    if (id && !propertyData) {
      // Si tenemos el ID pero no propertyData, intentar cargarlo
      handlePropertyData({ pID: id });
    }
  }, [id, propertyData, handlePropertyData]);

  // Timeout para evitar carga infinita
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
        setIsLoading(false);
      }
    }, 10000); // 10 segundos timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

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

      // Solo establecer editable si propertyData existe y tiene la estructura esperada
      if (propertyData && propertyData.propertyInfo) {
        setEditable(
          isAuthorResult && propertyData.propertyInfo.status === null
        );
      } else {
        setEditable(false);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setProperty(null);
    }
  };
  useEffect(() => {
    if (propertyData) {
      fetchProperty();
    }
  }, [propertyData]);

  // Componente de carga con el logo de Terrasacha
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-terrasacha-earth via-terrasacha-light to-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Logo principal con efecto de pulso */}
          <div className="animate-pulse-terrasacha">
            <div className="w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha-xl">
                  <div className="w-20 h-20 border-4 border-white rounded-full"></div>
                  <div className="absolute w-12 h-12 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Círculos concéntricos animados */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-terrasacha-primary/20 rounded-full animate-ping"></div>
            <div
              className="absolute w-48 h-48 border-4 border-terrasacha-secondary2/30 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-32 h-32 border-4 border-terrasacha-light/40 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-terrasacha-primary mb-2 font-typographica">
            Cargando Predio
          </h2>
          <p className="text-terrasacha-secondary1 font-typographica text-lg">
            Obteniendo información...
          </p>
        </div>

        {/* Indicador de progreso animado */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-terrasacha-primary rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-terrasacha-secondary2 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-terrasacha-light rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar componente de carga mientras esté cargando
  if (isLoading || (!property && !loadingTimeout) || !propertyData) {
    return <LoadingSpinner />;
  }

  // Si no hay datos después de cargar o hay timeout, mostrar error
  if ((!property && !isLoading) || loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-light via-terrasacha-earth to-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-terrasacha-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-terrasacha-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-terrasacha-primary mb-4 font-typographica">
            {loadingTimeout
              ? "Tiempo de espera agotado"
              : "Error al cargar el predio"}
          </h2>
          <p className="text-terrasacha-secondary1 font-typographica text-lg mb-6">
            {loadingTimeout
              ? "La carga está tomando más tiempo del esperado. Por favor, intenta de nuevo."
              : "No se pudo cargar la información del predio."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-terrasacha-primary font-typographica"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Central Content */}
      <div className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-terrasacha-light/20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Column - Información Principal */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-terrasacha-primary mb-3 font-typographica">
                {property?.name || "Predio sin nombre"}
              </h1>

              {/* Información del Predio en Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica">Ubicación</p>
                    <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                      {property?.department || "No especificado"}
                      {property?.city && `, ${property.city}`}
                    </p>
                  </div>
                </div>

                {property?.cadastralNumber && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">Número Catastral</p>
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        {property.cadastralNumber}
                      </p>
                    </div>
                  </div>
                )}

                {property?.area && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">Área</p>
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        {property.area} m²
                      </p>
                    </div>
                  </div>
                )}

                {property?.createdAt && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">Creado</p>
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        {new Date(property.createdAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {property?.description && (
                <div className="mt-4 pt-4 border-t border-terrasacha-light/20">
                  <p className="text-sm text-terrasacha-secondary1 font-typographica">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Estado y Badges */}
            <div className="flex flex-col items-end lg:items-start gap-3">
              {property?.status && (
                <div className="flex items-center space-x-2">
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-lg font-typographica shadow-sm"
                    style={{
                      backgroundColor: property.status === 'PENDING' ? '#e8d79a' :
                                      property.status === 'APPROVED' ? '#849b50' :
                                      property.status === 'REJECTED' ? '#dc3545' :
                                      property.status === 'SELECTABLE' || property.status === 'ELEGIBLE' ? '#849b50' : '#6e6c35',
                      color: property.status === 'PENDING' ? '#44482c' : 'white'
                    }}
                  >
                    {statusEs[property.status] || property.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información Contextual: Postulante, Campaña y Proyecto */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Información del Postulante */}
          <div className="bg-terrasacha-secondary1 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h3 className="text-base font-bold font-champagne">
                Postulante
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold mb-1 font-futura">
                  {property?.user?.name || "Sin nombre"}
                </h4>
                <p className="text-xs text-terrasacha-light font-typographica">
                  {property?.user?.email || "Sin email"}
                </p>
              </div>
              {property?.user?.role && (
                <div className="pt-2 border-t border-terrasacha-light/30">
                  <span className="inline-flex items-center px-2 py-1 bg-white/20 text-white text-xs rounded-md font-typographica">
                    {roleMapping[property.user.role] || property.user.role}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información de la Campaña */}
          {property?.campaign ? (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-terrasacha-secondary2/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-terrasacha-secondary2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-terrasacha-primary font-typographica">
                  Campaña
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                    Nombre
                  </p>
                  <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                    {property.campaign.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-terrasacha-light/20">
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                      Inicio
                    </p>
                    <p className="text-xs font-semibold text-terrasacha-primary font-typographica">
                      {property.campaign.initialDate
                        ? new Date(
                            property.campaign.initialDate * 1000
                          ).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                      Fin
                    </p>
                    <p className="text-xs font-semibold text-terrasacha-primary font-typographica">
                      {property.campaign.endDate
                        ? new Date(
                            property.campaign.endDate * 1000
                          ).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {property.campaign.description && (
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                      Descripción
                    </p>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica line-clamp-2">
                      {property.campaign.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4 opacity-50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-terrasacha-light/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-terrasacha-secondary1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-terrasacha-secondary1 font-typographica">
                  Campaña
                </h3>
              </div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica">
                Sin campaña asociada
              </p>
            </div>
          )}

          {/* Información del Proyecto */}
          {property?.product ? (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-terrasacha-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-terrasacha-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-terrasacha-primary font-typographica">
                  Proyecto
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                    Nombre
                  </p>
                  <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                    {property.product.name}
                  </p>
                </div>
                {property.product.category && (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 bg-terrasacha-light/20 text-terrasacha-primary text-xs rounded-md font-typographica">
                      {property.product.category.name}
                    </span>
                  </div>
                )}
                {property.product.description && (
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                      Descripción
                    </p>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica line-clamp-2">
                      {property.product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4 opacity-50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-terrasacha-light/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-terrasacha-secondary1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-terrasacha-secondary1 font-typographica">
                  Proyecto
                </h3>
              </div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica">
                Sin proyecto asignado
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-5">
          <nav className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto px-3 sm:px-4 py-2 bg-terrasacha-light/10 border border-terrasacha-light/20 rounded-md">
            <button
              onClick={() => setActiveTab("estado")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "estado"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver estado general"
            >
              Estado General
            </button>
            <button
              onClick={() => setActiveTab("predial")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "predial"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver información predial"
            >
              Información Predial
            </button>
            <button
              onClick={() => setActiveTab("catastral")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "catastral"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver información catastral"
            >
              Información Catastral
            </button>
            <button
              onClick={() => setActiveTab("propietarios")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "propietarios"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver propietarios"
            >
              Propietarios
            </button>
            <button
              onClick={() => setActiveTab("documentacion")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "documentacion"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver documentación"
            >
              Documentación
            </button>
            <button
              onClick={() => setActiveTab("trazabilidad")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "trazabilidad"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Ver trazabilidad"
            >
              Trazabilidad
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === "chat"
                  ? "bg-white text-[#6e6c35] shadow-lg"
                  : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
              }`}
              aria-label="Abrir chat"
            >
              Chat
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* Estado General */}
          {activeTab === "estado" && (
            <PropertyGeneral
              onNavigateToDocumentation={() => setActiveTab("documentacion")}
              onNavigateToOwners={() => setActiveTab("propietarios")}
              onNavigateToPredial={() => setActiveTab("predial")}
            />
          )}

          {/* Información Predial */}
          {activeTab === "predial" && (
            <PropertyDetails
              visible={true}
              setHasUnsavedChanges={setHasUnsavedChanges}
              handleFieldChange={handleFieldChange}
              setIsFormComplete={setIsFormComplete}
            />
          )}

          {/* Información Catastral */}
          {activeTab === "catastral" && (
            <PropertyCatastral
              visible={true}
              setHasUnsavedChanges={setHasUnsavedChanges}
              handleFieldChange={handleFieldChange}
              setIsFormComplete={setIsFormComplete}
            />
          )}

          {/* Propietarios */}
          {activeTab === "propietarios" && (
            <PropertyOwners
              visible={true}
              setHasUnsavedChanges={setHasUnsavedChanges}
              handleFieldChange={handleFieldChange}
              setIsFormComplete={setIsFormComplete}
            />
          )}

          {/* Documentación */}
          {activeTab === "documentacion" && (
            <PropertyDocumentation
              visible={true}
              setHasUnsavedChanges={setHasUnsavedChanges}
              handleFieldChange={handleFieldChange}
              setIsFormComplete={setIsFormComplete}
            />
          )}

          {/* Chat */}
          {activeTab === "chat" && <PropertyChat />}

          {/* Trazabilidad */}
          {activeTab === "trazabilidad" && (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica">
                  Registro de trazabilidad
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-terrasacha-secondary1 font-typographica">
                    Sistema Activo
                  </span>
                </div>
              </div>

              {/* Filtros de Log */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-terrasacha-primary text-white rounded-full text-xs font-typographica">
                    Todas
                  </button>
                  <button className="px-3 py-1 bg-terrasacha-light/20 text-terrasacha-secondary1 rounded-full text-xs font-typographica hover:bg-terrasacha-light/30">
                    Documentos
                  </button>
                  <button className="px-3 py-1 bg-terrasacha-light/20 text-terrasacha-secondary1 rounded-full text-xs font-typographica hover:bg-terrasacha-light/30">
                    Verificaciones
                  </button>
                  <button className="px-3 py-1 bg-terrasacha-light/20 text-terrasacha-secondary1 rounded-full text-xs font-typographica hover:bg-terrasacha-light/30">
                    Propietarios
                  </button>
                  <button className="px-3 py-1 bg-terrasacha-light/20 text-terrasacha-secondary1 rounded-full text-xs font-typographica hover:bg-terrasacha-light/30">
                    Sistema
                  </button>
                </div>
              </div>

              {/* Lista de Logs */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* Log 1 - Creación del predio */}
                <div className="flex items-start space-x-3 p-3 bg-terrasacha-light/5 rounded-lg border-l-4 border-terrasacha-primary">
                  <div className="w-8 h-8 bg-terrasacha-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Predio creado
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 2 horas
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      El predio fue registrado en el sistema por{" "}
                      <strong>María González</strong>
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-terrasacha-primary/10 text-terrasacha-primary text-xs rounded font-typographica">
                        Sistema
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 2 - Subida de documentos */}
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Documentos subidos
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 1 hora 30 min
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      Se subieron 3 documentos: Certificado de Libertad,
                      Escrituras Públicas y Planos Catastrales
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-typographica">
                        Documentos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 3 - Información de propietarios */}
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Propietarios registrados
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 1 hora
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      Se registró información de 2 propietarios:{" "}
                      <strong>Carlos Rodríguez</strong> y{" "}
                      <strong>Ana Martínez</strong>
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-typographica">
                        Propietarios
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 4 - Verificación asignada */}
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Verificación asignada
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 45 min
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      El predio fue asignado al verificador{" "}
                      <strong>Dr. Luis Fernández</strong> para revisión
                      técnica
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-typographica">
                        Verificaciones
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 5 - Verificación iniciada */}
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Verificación iniciada
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 30 min
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      <strong>Dr. Luis Fernández</strong> comenzó la revisión
                      de los documentos del predio
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-typographica">
                        Verificaciones
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 6 - Documento aprobado */}
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Documento aprobado
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 15 min
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      El <strong>Certificado de Libertad y Tradición</strong>{" "}
                      fue aprobado por <strong>Dr. Luis Fernández</strong>
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-typographica">
                        Verificaciones
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log 7 - Notificación enviada */}
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0 15 0v5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        Notificación enviada
                      </p>
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">
                        Hace 5 min
                      </span>
                    </div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica mt-1">
                      Se envió notificación a <strong>María González</strong>{" "}
                      sobre el progreso de la verificación
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-typographica">
                        Sistema
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del Log */}
              <div className="mt-6 pt-4 border-t border-terrasacha-light/20">
                <div className="flex items-center justify-between text-xs text-terrasacha-secondary1 font-typographica">
                  <span>Última actualización: Hace 2 minutos</span>
                  <span>Total de actividades: 7</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
