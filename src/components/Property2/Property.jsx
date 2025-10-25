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
import { S3ClientProvider } from "context/s3ClientContext";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { getProperty } from "graphql/queries";
import { usePropertyData } from "context/PropertyDataContext";
import { useAuth } from "context/AuthContext";
import TerrasachaLogo from "components/common/TerrasachaLogo";
import PropertyDetails from "./PropertyDetails";
import PropertyCatastral from "./PropertyCatastral";
import PropertyOwners from "./PropertyOwners";
import PropertyDocumentation from "./PropertyDocumentation";

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
  const [currentStep, setCurrentStep] = useState(1);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('estado');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-terrasacha-light to-white">
      {/* Mobile Header - Fixed */}
      <div className="lg:hidden bg-terrasacha-secondary1 shadow-terrasacha-lg fixed top-0 left-0 right-0 z-50">
        {/* Textura del header móvil al estilo WhatsApp */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='1.5'/%3E%3Ccircle cx='15' cy='45' r='1.5'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='10' cy='30' r='1.5'/%3E%3Ccircle cx='50' cy='30' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '45px 45px',
            backgroundPosition: '0 0, 22px 22px'
          }}></div>
        </div>
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-terrasacha-primary rounded-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-full"></div>
              <div className="absolute w-2 h-2 border border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-typographica mb-0">
                Terrasacha
              </h1>
              <p className="text-xs text-terrasacha-light font-champagne mb-0">
                Pioneros del Mañana
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 rounded-lg hover:bg-terrasacha-primary/20 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        </div>

      {/* Sidebar - Fixed */}
      <div
        className={`w-64 bg-terrasacha-secondary1 min-h-screen shadow-terrasacha-lg fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Textura del sidebar al estilo WhatsApp */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='1.5'/%3E%3Ccircle cx='15' cy='45' r='1.5'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='10' cy='30' r='1.5'/%3E%3Ccircle cx='50' cy='30' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '45px 45px',
            backgroundPosition: '0 0, 22px 22px'
          }}></div>
        </div>
        <div className="flex flex-col h-screen relative z-10">
          {/* Close button and logo for mobile */}
          <div className="lg:hidden flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {/* Logo circular con T */}
              <div className="w-10 h-10 bg-terrasacha-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg font-typographica">
                  T
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-typographica mb-0">
                  Terrasacha
                </h1>
                <p className="text-xs text-terrasacha-light font-champagne mb-0">
                  Pioneros del Mañana
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-terrasacha-primary/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenido principal - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4">
              {/* Logo Terrasacha - Hidden on mobile */}
              <div className="mb-8 pt-4 hidden lg:block">
                <div className="flex items-center space-x-3">
                  {/* Logo circular con T */}
                  <div className="w-10 h-10 bg-terrasacha-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg font-typographica">
                      T
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white font-typographica mb-0">
                      Terrasacha
                    </h1>
                    <p className="text-xs text-terrasacha-light font-champagne mb-0">
                      Pioneros del Mañana
                    </p>
                  </div>
                </div>
              </div>

               {/* Menu Items */}
               <nav className="space-y-1">
                 <a
                   href="#"
                   className="flex items-center space-x-3 px-6 py-3 text-white hover:bg-terrasacha-primary/20 rounded-lg transition-colors font-typographica no-underline"
                 >
                   <svg
                     className="w-5 h-5 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                     />
                   </svg>
                   <span className="text-white">Inicio</span>
                 </a>

                 <a
                   href="#"
                   className="flex items-center space-x-3 px-6 py-3 bg-terrasacha-secondary2 text-white rounded-lg shadow-terrasacha font-typographica no-underline"
                 >
                   <svg
                     className="w-5 h-5 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                     />
                   </svg>
                   <span className="text-white">Predios</span>
                 </a>

                 <a
                   href="#"
                   className="flex items-center space-x-3 px-6 py-3 text-white hover:bg-terrasacha-primary/20 rounded-lg transition-colors font-typographica no-underline"
                 >
                   <svg
                     className="w-5 h-5 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                     />
                   </svg>
                   <span className="text-white">Proyectos</span>
                 </a>

                 <a
                   href="#"
                   className="flex items-center space-x-3 px-6 py-3 text-white hover:bg-terrasacha-primary/20 rounded-lg transition-colors font-typographica no-underline"
                 >
                   <svg
                     className="w-5 h-5 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                     />
                   </svg>
                   <span className="text-white">Reportes</span>
                 </a>
               </nav>
            </div>
          </div>

          {/* Información del Usuario - Fijada en la parte inferior */}
          <div className="px-6 pb-6 border-t border-terrasacha-primary/20 pt-4 flex-shrink-0">
            <div className="space-y-2">
              <h3 className="text-xs text-terrasacha-light font-typographica uppercase tracking-wide">
                Usuario Actual
              </h3>

              <div className="flex items-center space-x-3">
                {/* Avatar con inicial */}
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-typographica">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white font-typographica truncate mb-0">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-terrasacha-light font-typographica truncate mb-0">
                    {user?.email || "Sin email"}
                  </p>
                </div>
              </div>

              {user?.role && (
                <div className="w-full">
                  <span className="block w-full text-center px-3 py-1 bg-terrasacha-secondary2 text-white text-xs rounded-full font-typographica font-semibold">
                    {roleMapping[user.role] || user.role}
                  </span>
                </div>
              )}

              {/* Botón de configuración de usuario */}
              <button
                onClick={handleUserSettings}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-terrasacha-light hover:bg-terrasacha-earth text-terrasacha-secondary1 rounded-lg transition-all duration-300 font-typographica text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] border border-terrasacha-light/30"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex lg:ml-64 pt-20 lg:pt-0">
        {/* Central Content */}
        <div className="flex-1 bg-white shadow-terrasacha">
          <div className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              {/* Breadcrumb */}
              <nav className="mb-4">
                <div className="flex flex-wrap items-center text-sm">
                  <span className="text-terrasacha-secondary2 font-typographica font-semibold">
                    Predio
                  </span>
                  {/* <span className="mx-2 text-terrasacha-light">/</span>
                  <span className="text-terrasacha-secondary1 font-typographica truncate">
                    {property?.campaign?.name || "Sin Campaña"}
                  </span> */}
                  <span className="mx-2 text-terrasacha-light">/</span>
                  <span className="text-terrasacha-secondary1 font-typographica truncate">
                    {property?.name || "Sin nombre"}
                  </span>
                </div>
              </nav>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-terrasacha-primary mb-2 font-typographica">
                {property?.name || "Predio sin nombre"}
              </h1>
              <div className="space-y-1">
                <p className="text-terrasacha-secondary1 font-typographica text-sm sm:text-base">
                  Ubicación: {property?.department || "No especificado"}
                </p>
                {property?.cadastralNumber && (
                  <p className="text-terrasacha-secondary1 font-typographica text-xs sm:text-sm">
                    Número Catastral: {property.cadastralNumber}
                  </p>
                )}
                {property?.description && (
                  <p className="text-terrasacha-secondary1 font-typographica text-xs sm:text-sm">
                    {property.description}
                  </p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-terrasacha-light/30 mb-6 sm:mb-8">
              <nav className="flex flex-wrap gap-2 sm:gap-4 lg:gap-8 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('estado')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'estado' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Estado General
                </button>
                <button 
                  onClick={() => setActiveTab('predial')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'predial' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Información Predial
                </button>
                <button 
                  onClick={() => setActiveTab('catastral')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'catastral' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Información Catastral
                </button>
                <button 
                  onClick={() => setActiveTab('propietarios')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'propietarios' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Propietarios
                </button>
                <button 
                  onClick={() => setActiveTab('documentacion')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'documentacion' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Documentación
                </button>
                <button 
                  onClick={() => setActiveTab('trazabilidad')}
                  className={`py-2 px-1 border-b-2 font-typographica font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === 'trazabilidad' 
                      ? 'border-terrasacha-primary text-terrasacha-primary' 
                      : 'border-transparent text-terrasacha-secondary1 hover:text-terrasacha-primary'
                  }`}
                >
                  Trazabilidad
                </button>
              </nav>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 sm:space-y-8">
              {/* Estado General */}
              {activeTab === 'estado' && (
                <div className="bg-gradient-to-r from-terrasacha-light/10 to-terrasacha-earth/10 p-4 sm:p-6 rounded-xl border border-terrasacha-light/20">
                  <h2 className="text-xl font-bold text-terrasacha-primary mb-4 font-typographica">
                    Estado del Predio
                  </h2>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-terrasacha-secondary1 font-typographica">
                        Estado Actual
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold font-typographica ${
                          property?.status === "APPROVED"
                            ? "bg-terrasacha-secondary2 text-white"
                            : property?.status === "PENDING"
                            ? "bg-terrasacha-earth text-terrasacha-secondary1"
                            : property?.status === "REJECTED"
                            ? "bg-red-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {statusEs[property?.status] || "Sin estado"}
                      </span>
                    </div>

                    {/* Progreso basado en verificaciones */}
                    <div className="mb-4">
                      <p className="text-sm text-terrasacha-secondary1 mb-3 font-typographica">
                        Progreso de Verificación
                      </p>
                      <div className="w-full bg-terrasacha-light/30 rounded-full h-3">
                        <div
                          className="bg-gradient-terrasacha h-3 rounded-full shadow-terrasacha transition-all duration-500"
                          style={{
                            width:
                              property?.propertyFeatures?.items?.length > 0
                                ? `${Math.min(
                                    (property.propertyFeatures.items.filter(
                                      (pf) => pf.verifications?.items?.length > 0
                                    ).length /
                                      property.propertyFeatures.items.length) *
                                      100,
                                    100
                                  )}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-terrasacha-secondary1 mt-2 font-typographica">
                        {property?.propertyFeatures?.items?.filter(
                          (pf) => pf.verifications?.items?.length > 0
                        ).length || 0}{" "}
                        de {property?.propertyFeatures?.items?.length || 0}{" "}
                        características verificadas
                      </p>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                          Propietario
                        </p>
                        <p className="text-sm font-semibold text-terrasacha-primary font-typographica truncate">
                          {property?.user?.name || "No especificado"}
                        </p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                          Proyecto
                        </p>
                        <p className="text-sm font-semibold text-terrasacha-primary font-typographica truncate">
                          {property?.product?.name || "Sin proyecto asignado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Información Predial */}
              {activeTab === 'predial' && (
                <PropertyDetails
                  visible={true}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  handleFieldChange={handleFieldChange}
                  setIsFormComplete={setIsFormComplete}
                  currentStep={currentStep}
                />
              )}

              {/* Información Catastral */}
              {activeTab === 'catastral' && (
                <PropertyCatastral
                  visible={true}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  handleFieldChange={handleFieldChange}
                  setIsFormComplete={setIsFormComplete}
                  currentStep={currentStep}
                />
              )}

              {/* Propietarios */}
              {activeTab === 'propietarios' && (
                <PropertyOwners
                  visible={true}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  handleFieldChange={handleFieldChange}
                  setIsFormComplete={setIsFormComplete}
                  currentStep={currentStep}
                />
              )}

              {/* Documentación */}
              {activeTab === 'documentacion' && (
                <PropertyDocumentation
                  visible={true}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  handleFieldChange={handleFieldChange}
                  setIsFormComplete={setIsFormComplete}
                  currentStep={currentStep}
                />
              )}

              {/* Trazabilidad */}
              {activeTab === 'trazabilidad' && (
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                          El predio fue registrado en el sistema por <strong>María González</strong>
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
                          Se subieron 3 documentos: Certificado de Libertad, Escrituras Públicas y Planos Catastrales
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                          Se registró información de 2 propietarios: <strong>Carlos Rodríguez</strong> y <strong>Ana Martínez</strong>
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                          El predio fue asignado al verificador <strong>Dr. Luis Fernández</strong> para revisión técnica
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                          <strong>Dr. Luis Fernández</strong> comenzó la revisión de los documentos del predio
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                          El <strong>Certificado de Libertad y Tradición</strong> fue aprobado por <strong>Dr. Luis Fernández</strong>
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
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0 15 0v5z" />
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
                          Se envió notificación a <strong>María González</strong> sobre el progreso de la verificación
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
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 bg-gradient-to-b from-terrasacha-earth/5 to-terrasacha-light/5 p-6">
          <div className="space-y-6">
            {/* Información del Proyecto */}
            <div className="bg-white rounded-xl overflow-hidden shadow-terrasacha border border-terrasacha-light/20">
              <div className="p-4">
                <h3 className="text-lg font-bold text-terrasacha-primary mb-3 font-typographica">
                  Proyecto
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-terrasacha-secondary1 font-typographica">
                      Nombre
                    </p>
                    <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                      {property?.product?.name || "Sin proyecto"}
                    </p>
                  </div>
                  {property?.product?.description && (
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">
                        Descripción
                      </p>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">
                        {property.product.description.length > 100
                          ? `${property.product.description.substring(
                              0,
                              100
                            )}...`
                          : property.product.description}
                      </p>
                    </div>
                  )}
                  {property?.product?.category && (
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">
                        Categoría
                      </p>
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        {property.product.category.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información de la Campaña */}
            {property?.campaign && (
              <div className="bg-white rounded-xl overflow-hidden shadow-terrasacha border border-terrasacha-light/20">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-terrasacha-primary mb-3 font-typographica">
                    Campaña
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">
                        Nombre
                      </p>
                      <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                        {property.campaign.name}
                      </p>
                    </div>
                    {property.campaign.description && (
                      <div>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica">
                          Descripción
                        </p>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica">
                          {property.campaign.description.length > 100
                            ? `${property.campaign.description.substring(
                                0,
                                100
                              )}...`
                            : property.campaign.description}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica">
                          Inicio
                        </p>
                        <p className="text-xs font-semibold text-terrasacha-primary font-typographica">
                          {property.campaign.initialDate
                            ? new Date(
                                property.campaign.initialDate
                              ).toLocaleDateString("es-ES")
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica">
                          Fin
                        </p>
                        <p className="text-xs font-semibold text-terrasacha-primary font-typographica">
                          {property.campaign.endDate
                            ? new Date(
                                property.campaign.endDate
                              ).toLocaleDateString("es-ES")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información del Propietario */}
            <div className="bg-gradient-terrasacha-dark rounded-xl p-6 text-white shadow-terrasacha-lg">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2 font-champagne">
                  Propietario
                </h3>
                <div className="mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2 font-futura">
                  {property?.user?.name || "Sin nombre"}
                </h4>
                <div className="border-t border-terrasacha-light/30 pt-2">
                  <p className="text-sm text-terrasacha-light font-typographica">
                    {property?.user?.email || "Sin email"}
                  </p>
                  {property?.user?.role && (
                    <p className="text-xs text-terrasacha-light font-typographica mt-1">
                      Rol: {property.user.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
