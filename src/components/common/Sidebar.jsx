import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Auth } from "aws-amplify";
import { BellFill } from "react-bootstrap-icons";
import { listNotifications } from "graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import NotificationsModal from "./NotificationsModal";
import TerrasachaLogo from "./TerrasachaLogo";
import Footer from "../views/Footer/Footer";
import { getProperty } from "graphql/queries";

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

const roleDisplayNames = {
  admon: "Administrador",
  validator: "Consultor",
  analyst: "Analista",
  constructor: "Postulante",
  legal: "Legal",
  investor: "Inversor",
};

const Sidebar = ({ children, onUserSettingsClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [showNotifications, setShowNotifications] = useState(false);
  const [messages, setMessages] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [property, setProperty] = useState(null);

  const fetchPendingMessages = async (userId) => {
    if (!userId) return;

    try {
      const response = await API.graphql(
        graphqlOperation(listNotifications, {
          filter: {
            userID: { eq: userId },
            isRead: { eq: false },
          },
        })
      );

      const notifications = response?.data?.listNotifications?.items || [];

      const formattedMessages = notifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        senderName: notification.userOrigin?.name || "Desconocido",
        senderRole: notification.userOrigin?.role || "Desconocido",
        propertyID: notification.resourceID || null,
        type: notification.type,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      }));

      formattedMessages.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const uniqueMessages = Array.from(
        new Map(formattedMessages.map((msg) => [msg.id, msg])).values()
      );

      setMessages(uniqueMessages);
    } catch (error) {
      console.error("❌ Error cargando notificaciones pendientes:", error);
    }
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        setAuthUser(data);
        const userId = data.attributes.sub;
        const role = data.attributes["custom:role"];

        if (["validator", "constructor", "legal"].includes(role)) {
          fetchPendingMessages(userId);
        }
      })
      .catch((err) => console.log("Error obteniendo usuario:", err));
  }, []);

  // Función para obtener el nombre de la vista según la ruta
  const getBreadcrumbLabel = () => {
    const path = location.pathname;
    
    // Rutas especiales con información adicional (se manejan en el render)
    if (path.startsWith("/property/")) {
      return ""; // Se manejará de forma especial
    }
    
    // Mapeo de rutas a nombres de vista
    const routeMap = {
      "/": "Inicio",
      "/constructor/home": "Inicio",
      "/legal/home": "Inicio",
      "/consultor/home": "Inicio",
      "/constructor": "Mis Predios",
      "/admon": "Administración",
      "/consultor_admon": "Consultor",
      "/legal_admon": "Validación de predios",
      "/project_analyst": "Analista",
      "/new_project": "Nuevo Proyecto",
      "/campaigns": "Campañas",
      "/new_campaign": "Nueva Campaña",
      "/PQRS": "PQRS",
      "/admindash": "Dashboard",
      "/products": "Productos",
      "/settings": "Configuración",
      "/tradicion-libertad": "Tradición y Libertad",
      "/escrituras": "Escrituras",
      "/planos-catastrales": "Planos Catastrales",
      "/creating_wallet": "Crear Wallet",
      "/terms_&_conditions": "Términos y Condiciones",
      "/use_terms": "Términos de Uso",
      "/privacy_policy": "Política de Privacidad",
      "/investor_admon": "Inversor",
      "/success_order": "Orden Exitosa",
    };
    
    // Buscar coincidencia exacta primero
    if (routeMap[path]) {
      return routeMap[path];
    }
    
    // Rutas con parámetros (buscar coincidencias parciales)
    if (path.startsWith("/project/")) {
      return "Proyecto";
    }
    if (path.startsWith("/campaign/")) {
      return "Campaña";
    }
    if (path.startsWith("/products/")) {
      return "Producto";
    }
    if (path.startsWith("/propertyOld/")) {
      return "Predio";
    }
    
    // Buscar coincidencias parciales para otras rutas
    for (const [route, label] of Object.entries(routeMap)) {
      if (path.startsWith(route + "/") || path === route) {
        return label;
      }
    }
    
    // Si no hay coincidencia, usar el pathname capitalizado
    const lastSegment = path.split("/").pop();
    if (lastSegment) {
      return lastSegment
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    
    return "Inicio";
  };

  // Cargar información del predio si estamos en la ruta /property/:id
  useEffect(() => {
    const fetchPropertyForBreadcrumb = async () => {
      if (location.pathname.startsWith("/property/") && params.id) {
        try {
          const data = await API.graphql(
            graphqlOperation(getProperty, { id: params.id })
          );
          setProperty(data.data.getProperty);
        } catch (error) {
          console.error("Error fetching property for breadcrumb:", error);
          setProperty(null);
        }
      } else {
        setProperty(null);
      }
    };

    fetchPropertyForBreadcrumb();
  }, [location.pathname, params.id]);

  const handleSignOut = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.attributes.sub;
      sessionStorage.removeItem(`pageReloadedForUser-${userId}`);

      await Auth.signOut();
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const handleShowNotifications = () => {
    const role = authUser?.attributes?.["custom:role"];
    if (role === "validator" || role === "constructor" || role === "legal") {
      const userId = authUser.attributes.sub;
      fetchPendingMessages(userId);
    }
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => setShowNotifications(false);

  const handleUserSettings = () => {
    navigate("/settings");
  };

  // Función para verificar si una ruta está activa
  const isRouteActive = (path, excludePaths = []) => {
    const currentPath = location.pathname;
    
    // Rutas exactas
    if (path === currentPath) return true;
    
    // Verificar si la ruta actual está en las exclusiones
    if (excludePaths.some(exclude => currentPath === exclude)) return false;
    
    // Casos especiales para rutas específicas
    if (path === "/constructor/home" && currentPath === "/constructor/home") return true;
    if (path === "/constructor" && currentPath === "/constructor" && currentPath !== "/constructor/home") return true;
    if (path === "/legal/home" && currentPath === "/legal/home") return true;
    if (path === "/consultor/home" && currentPath === "/consultor/home") return true;
    if (path === "/PQRS" && currentPath === "/PQRS") return true;
    if (path === "/" && currentPath === "/") return true;
    
    // Rutas que empiezan con el path (para rutas con parámetros)
    // Ejemplo: /project/123 debe coincidir con /project
    if (currentPath.startsWith(path + "/")) {
      // Excluir rutas hijas específicas si es necesario
      if (excludePaths.length > 0) {
        return !excludePaths.some(exclude => currentPath.startsWith(exclude));
      }
      return true;
    }
    
    return false;
  };

  const getMenuItemsByRole = () => {
    const role = authUser?.attributes?.["custom:role"];
    const items = [];
    const currentPath = location.pathname;
    const currentSearch = location.search || "";

    // Inicio - Disponible para todos
    // Para constructor/propietario, "Inicio" lleva al banner de registro
    // Para legal, "Inicio" lleva al banner de validación
    // Para otros roles, lleva a la landing page
    const inicioPath = role === "constructor" || role === "investor" 
      ? "/constructor/home" 
      : role === "legal"
      ? "/legal/home"
      : role === "validator"
      ? "/consultor/home"
      : "/";
    items.push({
      label: "Inicio",
      path: inicioPath,
      icon: (
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
      ),
      onClick: () => {
        if (role === "constructor" || role === "investor") {
          navigate("/constructor/home");
        } else if (role === "legal") {
          navigate("/legal/home");
        } else if (role === "validator") {
          navigate("/consultor/home");
        } else {
          navigate("/");
        }
      },
      active: isRouteActive(inicioPath),
    });

      // Mis Predios - Constructor e Investor
    if (role === "constructor" || role === "investor") {
      items.push({
        label: "Mis Predios",
        path: "/constructor",
        icon: (
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
        ),
        onClick: () => navigate("/constructor"),
        active: isRouteActive("/constructor", ["/constructor/home"]),
      });
    }

    // Mis Campañas - Validator
    if (role === "validator") {
      items.push({
        label: "Mis Campañas",
        path: "/consultor_admon",
        icon: (
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
        ),
        onClick: () => navigate("/consultor_admon"),
        active: isRouteActive("/consultor_admon"),
      });
      items.push({
        label: "Crear Campaña",
        path: "/new_campaign",
        icon: (
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        ),
        onClick: () => navigate("/new_campaign"),
        active: isRouteActive("/new_campaign"),
      });
    }

    // Administrar - Admon
    if (role === "admon") {
      const isOnAdmon = currentPath.startsWith("/admon");
      const isTabActive = (tab) =>
        isOnAdmon &&
        (currentSearch.includes(`tab=${tab}`) ||
          (!currentSearch && tab === "products"));

      // Menú de administración (solo visible para admin)
      items.push(
        {
          label: "Proyectos",
          path: "/admon?tab=products",
          icon: (
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
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=products"),
          active: isTabActive("products"),
        },
        {
          label: "Categorías",
          path: "/admon?tab=categorys",
          icon: (
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
                d="M4 6h16M4 12h8M4 18h4"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=categorys"),
          active: isTabActive("categorys"),
        },
        {
          label: "Items",
          path: "/admon?tab=items",
          icon: (
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
                d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=items"),
          active: isTabActive("items"),
        },
        {
          label: "Características",
          path: "/admon?tab=features",
          icon: (
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
                d="M12 6V4m0 16v-2m8-6h-2M6 12H4m12.364-5.657l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728L7.05 7.05m9.9 9.9l1.414 1.414"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=features"),
          active: isTabActive("features"),
        },
        {
          label: "Unidades de medida",
          path: "/admon?tab=uom",
          icon: (
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
                d="M3 3h18v4H3zM7 9h10v12H7z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=uom"),
          active: isTabActive("uom"),
        },
        {
          label: "Asignar consultores",
          path: "/admon?tab=assign_pf",
          icon: (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a3 3 0 10-6 0 3 3 0 006 0z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=assign_pf"),
          active: isTabActive("assign_pf"),
        },
        {
          label: "Asignar analistas",
          path: "/admon?tab=assign_analyst",
          icon: (
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
                d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m-4-3h8"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=assign_analyst"),
          active: isTabActive("assign_analyst"),
        },
        {
          label: "Consultores",
          path: "/admon?tab=validators",
          icon: (
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
                d="M5 20h14M12 14a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=validators"),
          active: isTabActive("validators"),
        },
        {
          label: "Analistas",
          path: "/admon?tab=analysts",
          icon: (
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
                d="M11 5a4 4 0 110 8 4 4 0 010-8zm-7 14a7 7 0 0114 0H4z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=analysts"),
          active: isTabActive("analysts"),
        },
        {
          label: "Legales",
          path: "/admon?tab=legales",
          icon: (
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
                d="M8 7V3h8v4M5 21h14V7H5v14z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=legales"),
          active: isTabActive("legales"),
        },
        {
          label: "Marketplace admin",
          path: "/admon?tab=marketplace_admin",
          icon: (
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
                d="M3 3h18v4H3zM5 7h14v14H5z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=marketplace_admin"),
          active: isTabActive("marketplace_admin"),
        },
        {
          label: "Estado de apps",
          path: "/admon?tab=apps_status",
          icon: (
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
                d="M9 17v-6l-2 2m8-2l-2 2v4M5 7h14M5 3h14v18H5z"
              />
            </svg>
          ),
          onClick: () => navigate("/admon?tab=apps_status"),
          active: isTabActive("apps_status"),
        }
      );
    }

    // Validación de predios - Legal
    if (role === "legal") {
      items.push({
        label: "Validación de predios",
        path: "/legal_admon",
        icon: (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
        onClick: () => navigate("/legal_admon"),
        active: isRouteActive("/legal_admon"),
      });
    }

    // PQRS - Solo para Propietario (constructor)
    if (role === "constructor") {
      items.push({
        label: "PQRS",
        path: "/PQRS",
        icon: (
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        onClick: () => navigate("/PQRS"),
        active: isRouteActive("/PQRS"),
      });
    }

    // Configuración - Disponible para todos los autenticados
    items.push({
      label: "Configuración",
      path: "/settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      onClick: () => navigate("/settings"),
      active: isRouteActive("/settings"),
    });

    return items;
  };

  // Si el usuario no está autenticado, renderizar solo el contenido sin sidebar
  if (!authUser) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Mobile Header - Fixed */}
      <div className="lg:hidden bg-terrasacha-secondary1 shadow-terrasacha-lg fixed top-0 left-0 right-0 z-50">
        {/* Textura del header móvil al estilo WhatsApp */}
        <div className="absolute inset-0 opacity-8">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='1.5'/%3E%3Ccircle cx='15' cy='45' r='1.5'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='10' cy='30' r='1.5'/%3E%3Ccircle cx='50' cy='30' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "45px 45px",
              backgroundPosition: "0 0, 22px 22px",
            }}
          ></div>
        </div>
        <div className="flex items-center justify-between p-4 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center brightness-200 contrast-100 cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Ir a inicio"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/");
              }
            }}
          >
            <TerrasachaLogo className="w-[140px] h-[35px]" />
            <p className="text-xs text-white font-champagne mb-0 mt-1">
              Pioneros del Mañana
            </p>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 rounded-lg hover:bg-terrasacha-primary/20 transition-colors"
            aria-label="Toggle menu"
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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='1.5'/%3E%3Ccircle cx='15' cy='45' r='1.5'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='10' cy='30' r='1.5'/%3E%3Ccircle cx='50' cy='30' r='1'/%3E%3Ccircle cx='30' cy='10' r='1'/%3E%3Ccircle cx='30' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "45px 45px",
              backgroundPosition: "0 0, 22px 22px",
            }}
          ></div>
        </div>
        <div className="flex flex-col h-screen relative z-10">
          {/* Close button and logo for mobile */}
          <div className="lg:hidden flex items-center justify-between p-4">
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center brightness-200 contrast-100 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Ir a inicio"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/");
                }
              }}
            >
              <TerrasachaLogo className="w-[160px] h-[40px]" />
              <p className="text-xs text-white font-champagne mb-0 mt-1">
                Pioneros del Mañana
              </p>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-terrasacha-primary/20 transition-colors"
              aria-label="Close menu"
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
                <button
                  onClick={() => navigate("/")}
                  className="flex flex-col items-center brightness-200 contrast-100 cursor-pointer hover:opacity-80 transition-opacity w-full"
                  aria-label="Ir a inicio"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate("/");
                    }
                  }}
                >
                  <TerrasachaLogo className="w-[180px] h-[45px]" />
                  <p className="text-xs text-white font-champagne mb-0 mt-1">
                    Pioneros del Mañana
                  </p>
                </button>
              </div>

              {/* Información del Usuario - Debajo del logo */}
              <div className="mb-6 py-6 border-b-2 border-t-2 border-terrasacha-primary/20 hidden lg:block">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar con inicial */}
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm font-typographica">
                        {(authUser?.username || user?.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white font-typographica truncate mb-0">
                        {authUser?.username?.toUpperCase() ||
                          user?.name ||
                          "Usuario"}
                      </p>
                      <p className="text-xs text-terrasacha-light font-typographica truncate mb-0">
                        {authUser?.attributes?.email ||
                          user?.email ||
                          "Sin email"}
                      </p>
                    </div>
                  </div>

                  {authUser?.attributes?.["custom:role"] && (
                    <div className="w-full">
                      <span className="block w-full text-center px-3 py-1 bg-terrasacha-secondary2 text-white text-xs rounded-full font-typographica font-semibold">
                        {roleDisplayNames[
                          authUser.attributes["custom:role"]
                        ] || authUser.attributes["custom:role"]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                {getMenuItemsByRole().map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-3 px-6 py-3 ${
                      item.active
                        ? "bg-terrasacha-secondary2 text-white shadow-terrasacha"
                        : "text-white hover:bg-terrasacha-primary/20"
                    } rounded-lg transition-colors font-typographica text-left`}
                  >
                    {item.icon}
                    <span className="text-white text-xs">{item.label}</span>
                  </button>
                ))}

                {/* Notificaciones - Solo para validator, legal, constructor */}
                {authUser &&
                  (authUser.attributes["custom:role"] === "validator" ||
                    authUser.attributes["custom:role"] === "legal" ||
                    authUser.attributes["custom:role"] === "constructor") && (
                    <button
                      type="button"
                      onClick={handleShowNotifications}
                      className="w-full flex items-center space-x-3 px-6 py-3 text-white hover:bg-terrasacha-primary/20 rounded-lg transition-colors font-typographica text-left relative"
                    >
                      <div className="relative">
                        {messages.length > 0 && (
                          <>
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                          </>
                        )}
                        <BellFill
                          className={`w-5 h-5 ${
                            messages.length > 0 ? "text-red-500" : "text-white"
                          }`}
                        />
                      </div>
                      <span className="text-white text-xs">Notificaciones</span>
                      {messages.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {messages.length}
                        </span>
                      )}
                    </button>
                  )}
              </nav>
            </div>
          </div>

          {/* Botón Cerrar Sesión - Fijado en la parte inferior */}
          <div className="px-6 pb-6 border-t border-terrasacha-primary/20 pt-4 flex-shrink-0">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white rounded-lg transition-all duration-300 font-typographica text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
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

      {/* Main Content Area with Footer */}
      <div className="flex flex-col min-h-screen lg:ml-64 pt-24 lg:pt-0">
        {/* Breadcrumb - Visible en todas las pantallas con sidebar */}
        <div className="bg-white border-b border-terrasacha-light/20 px-4 sm:px-6 lg:px-8 py-3 shadow-sm sticky top-0 z-40 lg:relative lg:z-auto">
          <nav>
            <div className="flex flex-wrap items-center text-sm">
              {location.pathname.startsWith("/property/") && property ? (
                // Breadcrumb especial para property con información detallada
                <>
                  <span className="text-terrasacha-secondary2 font-typographica font-semibold">
                    Predio
                  </span>
                  {property?.campaign && (
                    <>
                      <span className="mx-2 text-terrasacha-light">/</span>
                      <span className="text-terrasacha-secondary1 font-typographica truncate">
                        {property.campaign.name}
                      </span>
                    </>
                  )}
                  <span className="mx-2 text-terrasacha-light">/</span>
                  <span className="text-terrasacha-secondary1 font-typographica truncate">
                    {property?.name || "Sin nombre"}
                  </span>
                </>
              ) : (
                // Breadcrumb genérico para otras vistas
                <span className="text-terrasacha-secondary1 font-typographica font-semibold">
                  {getBreadcrumbLabel()}
                </span>
              )}
            </div>
          </nav>
        </div>
        <div className="flex-1 bg-white shadow-terrasacha">
          {children}
        </div>
        {/* Footer dentro del layout del Sidebar */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>

      {/* Modal de Notificaciones */}
      <NotificationsModal
        show={showNotifications}
        onClose={handleCloseNotifications}
        messages={messages}
        fetchPendingMessages={fetchPendingMessages}
        userId={authUser?.attributes?.sub}
      />
    </>
  );
};

export default Sidebar;

