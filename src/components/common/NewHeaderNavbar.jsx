import React, { useEffect, useRef, useState } from "react";
import TerrasachaLogo from "./TerrasachaLogo";
import { useNavigate } from "react-router";
import { Auth } from "aws-amplify";
import { BellFill } from "react-bootstrap-icons";
import { listNotifications } from "graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import NotificationsModal from "./NotificationsModal";

export default function NewHeaderNavbar() {
  const [user, setUser] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleOpenOffcanvas = () => setShowOffcanvas(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        setUser(data);
        const userId = data.attributes.sub;
        const role = data.attributes["custom:role"];

        if (["validator", "constructor", "legal"].includes(role)) {
          fetchPendingMessages(userId);
        }
      })
      .catch((err) => console.log("Error obteniendo usuario:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        const userId = data.attributes.sub;
        const reloadKey = `pageReloadedForUser-${userId}`;

        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, "true");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log("Error obteniendo usuario para control de reload:", err);
      });
  }, []);

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

  const handleSignOut = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.attributes.sub;
      sessionStorage.removeItem(`pageReloadedForUser-${userId}`);

      await Auth.signOut();
      localStorage.removeItem("role");
      window.location.href = "/";
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const handleShowNotifications = () => {
    const role = user?.attributes?.["custom:role"];
    if (role === "validator" || role === "constructor") {
      const userId = user.attributes.sub;
      fetchPendingMessages(userId, role);
    }
    setShowNotifications(true);
  };

  const role = user?.attributes?.["custom:role"];

  const roleDisplayNames = {
    admon: "Administrador",
    validator: "Consultor",
    analyst: "Analista",
    constructor: "Propietario",
    legal: "Legal",
    investor: "Inversor",
  };

  const displayRole = roleDisplayNames[role] || "Sin Rol";

  const handleCloseNotifications = () => setShowNotifications(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  /* const getNavLinksByRole = (role) => {
    const commonLinks = [
      <a
        key="ayuda"
        href="https://terrasacha.gitbook.io/terrasacha"
        target="_blank"
        rel="noopener noreferrer"
        className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
      >
        Ayuda
      </a>,
    ];

    const roleBasedLinks = {
      admon: [
        <button
          key="administrar"
          onClick={() => (window.location.href = "/admon")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          Administrar
        </button>,
      ],
      validator: [
        <button
          key="perfil-validator"
          onClick={() => (window.location.href = "/consultor_admon")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          Perfil
        </button>,
        <button
          key="pqrs-validator"
          onClick={() => (window.location.href = "/PQRS")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          PQRS
        </button>,
      ],
      legal: [
        <button
          key="perfil-legal"
          onClick={() => (window.location.href = "/legal_admon")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          Perfil
        </button>,
        <button
          key="pqrs-legal"
          onClick={() => (window.location.href = "/PQRS")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          PQRS
        </button>,
      ],
      analyst: [
        <button
          key="pqrs-analyst"
          onClick={() => (window.location.href = "/PQRS")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          PQRS
        </button>,
        <button
          key="proyectos-analyst"
          onClick={() => (window.location.href = "/project_analyst")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          Ver Proyectos
        </button>,
      ],
      constructor: [
        <button
          key="perfil-constructor"
          onClick={() => (window.location.href = "/constructor")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          Perfil
        </button>,
        <button
          key="pqrs-constructor"
          onClick={() => (window.location.href = "/PQRS")}
          className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
        >
          PQRS
        </button>,
      ],
    };

    return (roleBasedLinks[role] || []).concat(commonLinks);
  }; */

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-terrasacha-earth shadow-terrasacha-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <TerrasachaLogo className="w-[180px] h-[45px]" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex space-x-4 items-center">
              {user ? (
                // Authenticated User Navigation
                <>
                  {/* Botón "Mis Predios" para constructores e inversores */}
                  {(user.attributes["custom:role"] === "constructor" ||
                    user.attributes["custom:role"] === "investor") && (
                      <>
                        <button
                          onClick={() => navigate("/constructor")}
                          className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-semibold px-4 py-2 text-sm rounded-lg shadow-terrasacha transition-all duration-300 transform hover:scale-105"
                        >
                          Mis Predios
                        </button>
                      </>
                    )}

                  {/* Enlace "Mis Campañas" para Validators */}
                  {user.attributes["custom:role"] === "validator" && (
                    <>
                      <button
                        onClick={() => navigate("/consultor_admon")}
                        className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                      >
                        Mis campañas
                      </button>
                      <button
                        onClick={() => navigate("/new_campaign")}
                        className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                      >
                        Crear campaña
                      </button>
                    </>
                  )}

                  {user.attributes["custom:role"] === "admon" && (
                    <>
                      <button
                        onClick={() => navigate("/admon")}
                        className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                      >
                        Administrar
                      </button>
                    </>
                  )}

                  {user.attributes["custom:role"] === "legal" && (
                    <>
                      <button
                        onClick={() => navigate("/legal_admon")}
                        className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                      >
                        Perfil
                      </button>
                    </>
                  )}

                  <button
                    key="pqrs-constructor"
                    onClick={() => (window.location.href = "/PQRS")}
                    className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                  >
                    PQRS
                  </button>

                  {/* Ícono de Notificaciones para roles específicos */}
                  {(user.attributes["custom:role"] === "validator" ||
                    user.attributes["custom:role"] === "legal" ||
                    user.attributes["custom:role"] === "constructor") && (
                      <div
                        className="relative cursor-pointer flex items-center justify-center"
                        onClick={handleShowNotifications}
                      >
                        <div className="relative">
                          {messages.length > 0 && (
                            <>
                              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </>
                          )}
                          <BellFill
                            className={`w-5 h-5 ${messages.length > 0
                                ? "text-red-500"
                                : "text-terrasacha-secondary1"
                              }`}
                          />
                        </div>
                      </div>
                    )}

                  {/* Contenedor del usuario */}
                  <div className="flex space-x-1">
                    <div ref={profileMenuRef} className="relative">
                      <div
                        className="flex items-center bg-terrasacha-secondary1 text-white px-3 py-1.5 rounded-lg shadow-terrasacha text-sm cursor-pointer hover:bg-terrasacha-primary transition-all duration-300 h-10"
                        onClick={toggleProfileMenu}
                      >
                        <div className="bg-terrasacha-primary p-1 rounded-full flex items-center justify-center w-5 h-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="12"
                            viewBox="0 -960 960 960"
                            width="12"
                            fill="#fff"
                          >
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                          </svg>
                        </div>
                        <div className="ml-2 flex flex-col items-center justify-center min-w-0 flex-1">
                          <span className="text-white font-semibold text-xs truncate text-center w-full">
                            {user.username.toUpperCase()}
                          </span>
                          <span className="text-terrasacha-light text-xs leading-tight truncate text-center w-full">
                            {displayRole}
                          </span>
                        </div>
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {/* Menú desplegable del perfil */}
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            onClick={() => {
                              navigate('/settings');
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Configuración
                          </button>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setShowProfileMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </>
              ) : (
                // Non-authenticated User Navigation
                <div className="flex items-center space-x-4">
                  <a
                    href="#tecnologia"
                    className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                  >
                    Tecnología
                  </a>
                  <a
                    href="#porque"
                    className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                  >
                    ¿Por qué Terrasacha?
                  </a>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-terrasacha-secondary2 hover:bg-terrasacha-primary text-white font-semibold px-4 py-2 text-sm rounded-lg shadow-terrasacha transition-all duration-300 transform hover:scale-105"
                  >
                    Ingresar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={handleOpenOffcanvas}
              className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white p-2 rounded-lg transition-all duration-300"
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
      </div>

      {/* Mobile Offcanvas Menu */}
      {showOffcanvas && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleCloseOffcanvas}
          ></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-terrasacha-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-terrasacha-light">
                <a href="/" onClick={handleCloseOffcanvas}>
                  <TerrasachaLogo className="w-[180px] h-[45px]" />
                </a>
                <button
                  onClick={handleCloseOffcanvas}
                  className="text-terrasacha-secondary1 hover:text-terrasacha-primary text-2xl font-bold transition-all duration-300"
                >
                  ×
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {user ? (
                  // Authenticated User Mobile Navigation
                  <>
                    {/* Botón "Mis Predios" para constructores e inversores */}
                    {(user.attributes["custom:role"] === "constructor" ||
                      user.attributes["custom:role"] === "investor") && (
                        <button
                          onClick={() => {
                            navigate("/constructor");
                            handleCloseOffcanvas();
                          }}
                          className="w-full bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-semibold px-4 py-3 text-sm rounded-lg shadow-terrasacha transition-all duration-300"
                        >
                          Mis Predios
                        </button>
                      )}

                    {/* Enlace "Mis Campañas" para Validators */}
                    {user.attributes["custom:role"] === "validator" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/consultor_admon");
                            handleCloseOffcanvas();
                          }}
                          className="w-full text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 text-left py-2"
                        >
                          Mis campañas
                        </button>
                        <button
                          onClick={() => {
                            navigate("/new_campaign");
                            handleCloseOffcanvas();
                          }}
                          className="w-full text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 text-left py-2"
                        >
                          Crear campaña
                        </button>
                      </>
                    )}

                    {user.attributes["custom:role"] === "admon" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/admon");
                            handleCloseOffcanvas();
                          }}
                          className="w-full text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 text-left py-2"
                        >
                          Administrar
                        </button>
                      </>
                    )}

                    {user.attributes["custom:role"] === "legal" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/legal_admon");
                            handleCloseOffcanvas();
                          }}
                          className="w-full text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 text-left py-2"
                        >
                          Perfil
                        </button>
                      </>
                    )}

                    <button
                      key="pqrs-validator"
                      onClick={() => (window.location.href = "/PQRS")}
                      className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                    >
                      PQRS
                    </button>

                    {/* Notificaciones para móvil */}
                    {(user.attributes["custom:role"] === "validator" ||
                      user.attributes["custom:role"] === "legal" ||
                      user.attributes["custom:role"] === "constructor") && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-terrasacha-secondary1 font-medium text-sm">
                            Notificaciones
                          </span>
                          <div
                            className="relative cursor-pointer"
                            onClick={() => {
                              handleShowNotifications();
                              handleCloseOffcanvas();
                            }}
                          >
                            <div className="relative">
                              {messages.length > 0 && (
                                <>
                                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                </>
                              )}
                              <BellFill
                                className={`w-5 h-5 ${messages.length > 0
                                    ? "text-red-500"
                                    : "text-terrasacha-secondary1"
                                  }`}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Usuario en móvil */}
                    <div className="flex space-x-1 justify-between border-t border-terrasacha-light pt-4 mt-4 ">
                      <div className="flex items-center bg-terrasacha-secondary1 text-white px-3 py-1.5 rounded-lg shadow-terrasacha text-sm h-10">
                        <div className="bg-terrasacha-primary p-1 rounded-full flex items-center justify-center w-5 h-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="12"
                            viewBox="0 -960 960 960"
                            width="12"
                            fill="#fff"
                          >
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                          </svg>
                        </div>
                        <div className="ml-2 flex flex-col items-center justify-center min-w-0 flex-1">
                          <span className="text-white font-semibold text-xs truncate text-center w-full">
                            {user.username.toUpperCase()}
                          </span>
                          <span className="text-terrasacha-light text-xs leading-tight truncate text-center w-full">
                            {displayRole}
                          </span>
                        </div>
                      </div>

                      {/* Botón Desconectar con icono */}
                      <button
                        className="flex items-center justify-center bg-terrasacha-secondary1 hover:bg-terrasacha-primary text-white p-2 rounded-lg shadow-terrasacha transition-all duration-300 h-10 w-10"
                        onClick={() => {
                          handleSignOut();
                          handleCloseOffcanvas();
                        }}
                        title="Desconectar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          viewBox="0 -960 960 960"
                          width="16"
                          fill="currentColor"
                        >
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  // Non-authenticated User Mobile Navigation
                  <div className="space-y-4">
                    <a
                      href="#tecnologia"
                      className="block text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 py-2"
                      onClick={handleCloseOffcanvas}
                    >
                      Tecnología
                    </a>
                    <a
                      href="#porque"
                      className="block text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300 py-2"
                      onClick={handleCloseOffcanvas}
                    >
                      ¿Por qué Terrasacha?
                    </a>
                    <a
                      key="ayuda"
                      href="https://terrasacha.gitbook.io/terrasacha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terrasacha-secondary1 hover:text-terrasacha-primary font-medium text-sm transition-all duration-300"
                    >
                      Ayuda
                    </a>
                    <button
                      onClick={() => {
                        window.location.href = "/login";
                        handleCloseOffcanvas();
                      }}
                      className="w-full bg-terrasacha-secondary2 hover:bg-terrasacha-primary text-white font-semibold px-4 py-3 text-sm rounded-lg shadow-terrasacha transition-all duration-300"
                    >
                      Ingresar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificaciones */}
      <NotificationsModal
        show={showNotifications}
        onClose={handleCloseNotifications}
        messages={messages}
        fetchPendingMessages={fetchPendingMessages}
        userId={user?.attributes?.sub}
      />
    </nav>
  );
}


