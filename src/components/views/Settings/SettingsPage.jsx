import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
import { updateUser, getUser } from "../../../graphql/mutations";
import { getUser as getUserQuery } from "../../../graphql/queries";
import DisableAccountModal from "../../Modals/DisableAccountModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cellphone: "",
    address: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showDisableModal, setShowDisableModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log("🔄 Cargando datos del usuario...");
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.attributes.sub;

      console.log("🔄 Usuario autenticado:", currentUser);
      console.log("🔄 User ID:", userId);

      // Intentar cargar datos de GraphQL
      try {
        console.log("🔄 Intentando cargar datos con GraphQL...");
        console.log("🔄 User ID para query:", userId);
        console.log("🔄 Query getUser:", getUserQuery);

        const result = await API.graphql({
          query: getUserQuery,
          variables: { id: userId },
          authMode: "API_KEY",
        });

        console.log("🔄 Resultado de la query:", result);

        const userData = result.data.getUser;
        if (userData) {
          console.log("🔄 Datos del usuario cargados desde GraphQL:", userData);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || currentUser.attributes.email || "",
            cellphone: userData.cellphone || "",
            address: userData.addresss || "",
            dateOfBirth: userData.dateOfBirth || "",
          });
          console.log("🔄 Formulario actualizado con datos de GraphQL");
        } else {
          throw new Error("No se encontraron datos del usuario en GraphQL");
        }
      } catch (graphqlError) {
        console.log(
          "⚠️ Error en GraphQL, usando datos de Cognito:",
          graphqlError
        );
        // Usar datos de Cognito como fallback
        setUser({
          id: userId,
          name: currentUser.attributes.name || "",
          email: currentUser.attributes.email || "",
          role: currentUser.attributes["custom:role"] || "constructor",
        });
        setFormData({
          name: currentUser.attributes.name || "",
          email: currentUser.attributes.email || "",
          cellphone: "",
          address: "",
          dateOfBirth: "",
        });
        console.log("🔄 Formulario actualizado con datos de Cognito");
      }
    } catch (error) {
      console.error("❌ Error general cargando datos del usuario:", error);
      // En caso de error general, usar datos básicos de Cognito
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser({
          id: currentUser.attributes.sub,
          name: currentUser.attributes.name || "",
          email: currentUser.attributes.email || "",
          role: currentUser.attributes["custom:role"] || "constructor",
        });
        setFormData({
          name: currentUser.attributes.name || "",
          email: currentUser.attributes.email || "",
          cellphone: "",
          address: "",
          dateOfBirth: "",
        });
        console.log("🔄 Formulario actualizado con datos básicos de Cognito");
      } catch (authError) {
        console.error("❌ Error de autenticación:", authError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      console.log("🔄 Guardando perfil...", formData);
      console.log("🔄 Usuario actual:", user);
      console.log("🔄 Datos a enviar:", {
        id: user.id,
        name: formData.name,
        cellphone: formData.cellphone,
        addresss: formData.address,
        dateOfBirth: formData.dateOfBirth,
      });

      // Verificar autenticación antes de hacer la petición
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log("🔄 Usuario autenticado para guardar:", currentUser);

      const result = await API.graphql({
        query: updateUser,
        variables: {
          input: {
            id: user.id,
            name: formData.name,
            cellphone: formData.cellphone,
            addresss: formData.address,
            dateOfBirth: formData.dateOfBirth,
          },
        },
        authMode: "API_KEY",
      });

      console.log("✅ Resultado de la mutación:", result);
      console.log("✅ Perfil actualizado exitosamente");
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("❌ Error actualizando perfil:", error);
      console.error("❌ Tipo de error:", error.constructor.name);
      console.error("❌ Código de error:", error.code);
      console.error("❌ Mensaje de error:", error.message);
      console.error("❌ Errores GraphQL:", error.errors);

      if (error.errors && error.errors[0]) {
        const graphqlError = error.errors[0];
        console.error("❌ Error GraphQL específico:", graphqlError);
        console.error("❌ Tipo de error GraphQL:", graphqlError.errorType);
        console.error("❌ Mensaje GraphQL:", graphqlError.message);

        if (graphqlError.errorType === "UnauthorizedException") {
          toast.error(
            "No tienes permisos para actualizar el perfil. El esquema GraphQL necesita ser desplegado con las nuevas reglas de autorización."
          );
        } else if (
          graphqlError.message &&
          graphqlError.message.includes("401")
        ) {
          toast.error(
            "Error de autenticación (401). El esquema GraphQL necesita ser desplegado con las nuevas reglas de autorización."
          );
        } else {
          toast.error(`Error al actualizar el perfil: ${graphqlError.message}`);
        }
      } else if (error.message && error.message.includes("401")) {
        toast.error(
          "Error de autenticación (401). El esquema GraphQL necesita ser desplegado con las nuevas reglas de autorización."
        );
      } else {
        toast.error("Error al actualizar el perfil. Verifica tu conexión.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleShowDisableModal = () => {
    console.log("🔄 Abriendo modal de desactivación...");
    setShowDisableModal(true);
  };

  const handleCloseDisableModal = () => {
    setShowDisableModal(false);
  };

  const handleDisableSuccess = (message) => {
    toast.success(message || "Cuenta desactivada exitosamente.");
    // Redirigir al login después de desactivar
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terrasacha-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 font-typographica">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold text-left text-terrasacha-primary flex-shrink-0 font-typographica">
                  Configuración de Cuenta
                </h1>
              </div>
              <p className="text-sm text-gray-600 mt-1 font-typographica">
                Gestiona tu información personal y preferencias de seguridad
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-terrasacha-light/20">
            {/* Modern Tabs */}
            <nav className="flex space-x-2 px-4 sm:px-6 py-3 bg-terrasacha-light/10 border-b border-terrasacha-light/20">
              <button
                onClick={() => setActiveTab("personal")}
                className={`py-2.5 px-4 sm:px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "personal"
                    ? "bg-white text-terrasacha-primary shadow-lg"
                    : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-typographica">Información Personal</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`py-2.5 px-4 sm:px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "security"
                    ? "bg-white text-terrasacha-primary shadow-lg"
                    : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-typographica">Seguridad</span>
                </div>
              </button>
              {user?.role === "constructor" && (
                <button
                  onClick={() => setActiveTab("danger")}
                  className={`py-2.5 px-4 sm:px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === "danger"
                      ? "bg-terrasacha-secondary1 text-white shadow-lg"
                      : "text-terrasacha-secondary1 hover:text-white hover:bg-terrasacha-secondary1/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-typographica">Zona de Peligro</span>
                  </div>
                </button>
              )}
            </nav>

            {/* Tab Content */}
            <div className="p-8">
              {/* Información Personal */}
              {activeTab === "personal" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 font-typographica mb-2">
                      Información Personal
                    </h3>
                    <p className="text-gray-600 font-typographica">
                      Actualiza tu información personal y de contacto
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-typographica">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200"
                          placeholder="Ingresa tu nombre completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-typographica">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 font-typographica">
                          El email no se puede modificar
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-typographica">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={formData.cellphone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cellphone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200"
                          placeholder="+57 300 123 4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 font-typographica">
                          Fecha de nacimiento
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 font-typographica">
                        Dirección
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200 resize-none"
                        placeholder="Ingresa tu dirección completa"
                      />
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary2 hover:from-terrasacha-secondary1 hover:to-terrasacha-primary text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-typographica"
                      >
                        {saving ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="font-typographica">Guardando...</span>
                          </div>
                        ) : (
                          <span className="font-typographica">Guardar Cambios</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Seguridad */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 font-typographica mb-2">
                      Seguridad
                    </h3>
                    <p className="text-gray-600 font-typographica">
                      Gestiona la seguridad de tu cuenta y datos personales
                    </p>
                  </div>

                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-terrasacha-light/20 to-white p-6 rounded-2xl border border-terrasacha-light/40">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-terrasacha-primary rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 font-typographica">
                          Contraseña
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4 font-typographica">
                        Para cambiar tu contraseña, usa la opción "¿Olvidaste tu
                        contraseña?" en el login.
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-medium py-2 px-4 rounded-lg transition-colors font-typographica"
                      >
                        Ir al login
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-terrasacha-light/20 to-white p-6 rounded-2xl border border-terrasacha-light/40">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-terrasacha-secondary2 rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 font-typographica">
                          2FA
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4 font-typographica">
                        La autenticación de dos factores está habilitada para tu
                        cuenta.
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-terrasacha-light text-terrasacha-secondary1 font-typographica">✓ Activa</span>
                    </div>

                    <div className="bg-gradient-to-br from-terrasacha-light/20 to-white p-6 rounded-2xl border border-terrasacha-light/40">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-terrasacha-secondary2 rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 font-typographica">
                          Sesiones
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4 font-typographica">
                        Sesión actual iniciada el{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => {
                          Auth.signOut();
                          navigate("/login");
                        }}
                        className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-medium py-2 px-4 rounded-lg transition-colors font-typographica"
                      >
                        Cerrar sesión
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-terrasacha-light/20 to-white p-6 rounded-2xl border border-terrasacha-light/40">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-terrasacha-primary rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 font-typographica">
                          Privacidad
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-4 font-typographica">
                        Tus datos están protegidos y solo se usan para los
                        servicios de la plataforma.
                      </p>
                      <a
                        href="/privacy_policy"
                        target="_blank"
                        className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block font-typographica"
                      >
                        Ver política
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Zona de Peligro - Solo para constructores */}
              {activeTab === "danger" && user?.role === "constructor" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-terrasacha-secondary1 font-typographica mb-2">
                      Zona de Peligro
                    </h3>
                    <p className="text-gray-600 font-typographica">
                      Acciones permanentes e irreversibles
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-terrasacha-light/20 to-white border-2 border-terrasacha-secondary1/40 rounded-2xl p-8 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-terrasacha-secondary1 rounded-full">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <h4 className="text-xl font-bold text-gray-900 mb-4 font-typographica">
                        Desactivar Cuenta
                      </h4>
                      <p className="text-gray-700 mb-6 leading-relaxed font-typographica">
                        Si desactivas tu cuenta, se eliminará{" "}
                        <strong>permanentemente</strong> y no podrás
                        recuperarla. Perderás acceso a todos tus predios,
                        proyectos y datos asociados.
                      </p>

                      <div className="bg-white rounded-xl p-4 mb-6 border border-terrasacha-secondary1/40">
                        <h5 className="font-semibold text-terrasacha-secondary1 mb-2 font-typographica">
                          ⚠️ Consecuencias:
                        </h5>
                        <ul className="text-sm text-terrasacha-secondary1 text-left space-y-1 font-typographica">
                          <li>• Todos tus datos personales serán eliminados</li>
                          <li>• Perderás acceso a todos tus proyectos</li>
                          <li>• No podrás recuperar tu cuenta</li>
                          <li>• Esta acción es irreversible</li>
                        </ul>
                      </div>

                      <button
                        onClick={handleShowDisableModal}
                        className="bg-gradient-to-r from-terrasacha-secondary1 to-terrasacha-primary hover:from-terrasacha-primary hover:to-terrasacha-secondary1 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-typographica"
                      >
                        Desactivar Mi Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Modal de desactivación */}
      <DisableAccountModal
        isOpen={showDisableModal}
        onClose={handleCloseDisableModal}
        onSuccess={handleDisableSuccess}
        user={user}
      />
    </div>
  );
};

export default SettingsPage;
