import { Auth, Hub } from "aws-amplify";
import React, { useEffect, useState } from "react";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import { createUser, updateUser } from "../../../graphql/mutations";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TerrasachaLogo from "components/common/TerrasachaLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notify } from "utilities/notify";
import backgroundImage from "../_images/0162_cesar_david_martinez.jpg";
import TermsModal from "components/common/TermsModal";

const initialFormState = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  authCode: "",
  formType: "signIn",
  terms: false,
  privacy_policy: false,
  role: "constructor",
  code: "",
  totpCode: "",
};

export default function LogIn() {
  const navigate = useNavigate();
  const [formState, updateFormState] = useState(initialFormState);
  const [signInUserData, setSignInUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    specialChar: false,
    uppercase: false,
    lowercase: false,
  });
  const [showPopover, setShowPopover] = useState(false);
  const [inputError, setInputError] = useState({ username: "" });
  const [explain, setExplain] = useState(
    "Una persona, empresa, fondo u organización que quiere rentabilizar su dinero a través de la creación de riqueza con un componente de impacto y protección del medio ambiente"
  );
  const [resendMessage, setResendMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showResendButton, setShowResendButton] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  let role = localStorage.getItem("role");

  useEffect(() => {
    setAuthListener();
  }, []);

  useEffect(() => {
    if (formState.formType === "signedIn") {
      const redirectPath = window.sessionStorage.getItem("redirect_after_login");
      if (redirectPath) {
        const pathArray = JSON.parse(redirectPath);
        window.sessionStorage.removeItem("redirect_after_login");
        navigate("/" + pathArray.join("/"));
      } else {
        navigate("/");
      }
    }
  }, [formState.formType, navigate]);

  async function setAuthListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signOut":
          updateFormState(() => ({ ...formState, formType: "signUp" }));
          break;
        default:
          break;
      }
    });
  }

  function validatePassword(password) {
    const validations = {
      length: password.length >= 8,
      number: /\d/.test(password),
    };

    setPasswordValidations(validations);
    return validations;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    updateFormState((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      validatePassword(value);
      setShowPopover(true);
    }
  }

  function onChange(e) {
    e.persist();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
    if (e.target.name === "password") {
      const validations = validatePassword(e.target.value);
      setShowPopover(true);
    }
    if (e.target.name === "username")
      setInputError((prevState) => ({
        ...prevState,
        username: validarString(e.target.value, /^[a-zA-Z0-9_]+$/),
      }));
    if (e.target.value === "constructor")
      setExplain(
        "Dueño de un predio interesado en transformar un predio en un activo ambiental monetizable"
      );
  }

  function validarString(str, regex) {
    if (!regex.test(str)) {
      return "Espacios y caracteres especiales no permitidos";
    }
    return "";
  }

  const { formType } = formState;

  async function signUp(e) {
    e.preventDefault();
    const {
      username,
      email,
      password,
      role,
      confirmPassword,
      terms,
      privacy_policy,
    } = formState;

    const validations = validatePassword(password);

    if (!validations.length || !validations.number) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    if (!terms) setError("Debe aceptar términos y condiciones");
    if (!privacy_policy) setError("Debe aceptar la politica de privacidad");
    if (username.length < 1) setError("Debe ingresar un nombre de usuario");
    if (email.length < 1) setError("Debe ingresar un email");
    if (password !== confirmPassword) setError("Las contraseñas no coinciden.");

    try {
      setError("");
      setLoading(true);
      let response = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          "custom:role": role,
        },
      });
      const userPayload = {
        id: response.userSub,
        name: username,
        isProfileUpdated: true,
        role: role,
        email: email,
      };
      await API.graphql(graphqlOperation(createUser, { input: userPayload }));
      setLoading(false);
      updateFormState(() => ({ ...formState, formType: "confirmSignUp" }));
    } catch (error) {
      setLoading(false);
      setExplain(
        "Una persona, empresa, fondo u organización que quiere rentabilizar su dinero a través de la creación de riqueza con un componente de impacto y protección del medio ambiente"
      );
      setError("El nombre de usuario ya existe. Por favor, escoja otro.");
    }
  }

  async function confirmSignUp(e) {
    e.preventDefault();
    try {
      setError("");
      const { username, authCode } = formState;
      setLoading(true);
      await Auth.confirmSignUp(username, authCode);
      setLoading(false);
      updateFormState(() => ({ ...formState, formType: "signIn" }));
    } catch (error) {
      setLoading(false);
      updateFormState({ ...formState, authCode: "" });
      setError("el código no coincide");
    }
  }

  const handleResendCode = async (e, username) => {
    e.preventDefault();
    if (!canResend) return;
    const { CodeDeliveryDetails } = await Auth.resendSignUp(username);
    if (CodeDeliveryDetails) {
      setResendMessage(`El código ha sido enviado nuevamente`);
      setCanResend(false);
      setShowResendButton(false);
      setResendTimer(30);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            setShowResendButton(true);
            setResendMessage("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleTermsAccept = (accepted) => {
    updateFormState(() => ({
      ...formState,
      terms: Boolean(accepted),
    }));
  };

  const handlePrivacyAccept = (accepted) => {
    updateFormState(() => ({
      ...formState,
      privacy_policy: Boolean(accepted),
    }));
  };

  async function signIn(e) {
    e.preventDefault();
    const { username, password } = formState;

    try {
      setError("");
      setLoading(true);

      const response = await Auth.signIn(username, password);

      if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
        setLoading(false);
        setUser(response);
        updateFormState(() => ({ ...formState, formType: "changePassword" }));
      } else if (response.challengeName === "SOFTWARE_TOKEN_MFA") {
        setLoading(false);
        updateFormState(() => ({ ...formState, formType: "confirmTOTP" }));
        setSignInUserData(response);
      } else {
        updateFormState(() => ({ ...formState, formType: "signedIn" }));
        let currentUser = await Auth.currentAuthenticatedUser();
        currentUser = currentUser.attributes["custom:role"];
        localStorage.setItem("role", currentUser);
      }
    } catch (error) {
      console.error("🔴 Error al iniciar sesión:", error);

      const errorMessages = {
        UserNotFoundException: "El nombre de usuario ingresado no está registrado.",
        NotAuthorizedException: "La contraseña es incorrecta. Por favor, vuelve a intentarlo.",
        UserNotConfirmedException: "Tu cuenta no ha sido confirmada. Revisa tu correo electrónico.",
        PasswordResetRequiredException: "Debes restablecer tu contraseña para iniciar sesión.",
      };

      setError(errorMessages[error.code] || "Ocurrió un error inesperado. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmTOTP(e) {
    e.preventDefault();
    const { totpCode } = formState;
    const { username } = formState;
    try {
      setError("");
      setLoading(true);

      const response = await Auth.confirmSignIn(
        signInUserData,
        totpCode,
        "SOFTWARE_TOKEN_MFA"
      );

      updateFormState(() => ({ ...formState, formType: "signedIn" }));
      let currentUser = await Auth.currentAuthenticatedUser();
      currentUser = currentUser.attributes["custom:role"];
      localStorage.setItem("role", currentUser);
    } catch (error) {
      setError("Código TOTP no válido. Por favor, inténtelo de nuevo.");
    }
    setLoading(false);
  }

  async function forgotPassword(e) {
    e.preventDefault();
    const { username } = formState;

    if (!username) {
      setError("Por favor, ingrese su nombre de usuario.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await Auth.forgotPassword(username);
      updateFormState(() => ({ ...formState, formType: "confirmFPcode" }));
      setError("Hemos enviado un código de recuperación a su correo electrónico.");
    } catch (error) {
      setLoading(false);

      if (error.code === "UserNotFoundException") {
        setError("El usuario ingresado no existe. Por favor, verifique e intente nuevamente.");
      } else if (error.code === "LimitExceededException") {
        setError("Se ha excedido el límite de intentos. Por favor, espere un momento antes de intentarlo nuevamente.");
      } else {
        setError("Ocurrió un error al intentar recuperar la contraseña. Por favor, intente nuevamente.");
      }
    }
    setLoading(false);
  }

  async function confirmNewPassword(e) {
    e.preventDefault();
    const { username, code, password } = formState;

    const validations = validatePassword(password);

    if (!validations.length || !validations.number) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await Auth.forgotPasswordSubmit(username, code, password);
      updateFormState(() => ({ ...formState, formType: "signIn" }));
    } catch (error) {
      setLoading(false);

      if (error.code === "CodeMismatchException") {
        setError("El código de verificación no es válido. Inténtalo de nuevo.");
      } else if (error.code === "ExpiredCodeException") {
        setError("El código ha expirado. Por favor, solicita uno nuevo.");
      } else {
        setError("Hubo un error al confirmar la nueva contraseña.");
      }
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = formState;

    const validations = validatePassword(newPassword);

    if (!validations.length || !validations.number) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (newPassword === confirmNewPassword) {
        await Auth.completeNewPassword(user, newPassword);

        const currentUser = await Auth.currentAuthenticatedUser();
        const userId = currentUser.attributes.sub;

        const updateUserPayload = {
          id: userId,
          status: "confirmed",
        };

        const response = await API.graphql(
          graphqlOperation(updateUser, { input: updateUserPayload })
        );

        notify("Contraseña cambiada con éxito y perfil actualizado.");
        updateFormState(() => ({ ...formState, formType: "signedIn" }));
      } else {
        setError("Las contraseñas no coinciden.");
      }
    } catch (error) {
      setError("Error al cambiar la contraseña.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary2 flex items-center overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      <ToastContainer />
      
      {/* Left Container - Info Section */}
      <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 justify-center items-center relative z-10">
        <div className="w-3/5 text-white">
          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-6 leading-tight">
            Aceleramos la transición hacia un mundo de carbono neutral
          </h2>
          <p className="text-lg xl:text-xl 2xl:text-2xl leading-relaxed opacity-90">
            Somos un motor alternativo para facilitar el desarrollo,
            financiación e implementación de proyectos de mitigación de cambio
            climático
          </p>
        </div>
      </div>

      {/* Right Container - Form Section */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex justify-center items-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Sign Up Form */}
          {formType === "signUp" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Registro</h2>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <input
                    name="username"
                    onChange={onChange}
                    placeholder="Usuario"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  {inputError.username && (
                    <p className="mt-1 text-red-600 text-xs">{inputError.username}</p>
                  )}
                  <p className="mt-1 text-gray-500 text-xs">
                    El nombre de usuario no debe contener espacios
                  </p>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    onChange={onChange}
                    placeholder="Example@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={onChange}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    placeholder="Contraseña"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                {focusPassword && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <ul className="space-y-2 text-sm">
                      <li className={`flex items-center ${passwordValidations.length ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2">✅</span>
                        Al menos 8 caracteres
                      </li>
                      <li className={`flex items-center ${passwordValidations.number ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2">✅</span>
                        Al menos 1 número
                      </li>
                    </ul>
                  </div>
                )}

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={onChange}
                    placeholder="Confirmar Contraseña"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Rol</label>
                  <input
                    type="text"
                    name="role"
                    value="Propietario"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-gray-500 text-xs">{explain}</p>
                </div>

                <div className="space-y-4">
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formState.terms}
                      onClick={() => setShowTermsModal(true)}
                      className="mt-1 mr-3 text-terrasacha-primary focus:ring-terrasacha-primary cursor-pointer"
                    />
                    <label className="text-sm text-gray-700 cursor-pointer" onClick={() => setShowTermsModal(true)}>
                      Acepto los{" "}
                      <span className="text-terrasacha-primary hover:underline font-medium transition-colors duration-200">
                        Términos de uso
                      </span>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="privacy_policy"
                      checked={formState.privacy_policy}
                      onClick={() => setShowPrivacyModal(true)}
                      className="mt-1 mr-3 text-terrasacha-primary focus:ring-terrasacha-primary cursor-pointer"
                    />
                    <label className="text-sm text-gray-700 cursor-pointer" onClick={() => setShowPrivacyModal(true)}>
                      Acepto la{" "}
                      <span className="text-terrasacha-primary hover:underline font-medium transition-colors duration-200">
                        Política de privacidad
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={(e) => signUp(e)}
                  disabled={loading || !formState.terms || !formState.privacy_policy}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading || !formState.terms || !formState.privacy_policy
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Cargando..." : "Registrarse"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                <button
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signIn",
                    }))
                  }
                  className="text-terrasacha-primary hover:text-terrasacha-secondary1 font-semibold transition-colors duration-300"
                >
                  Ingresar
                </button>
              </div>
            </div>
          )}

          {/* Confirm Sign Up Form */}
          {formType === "confirmSignUp" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Confirmación</h2>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                Código de verificación enviado a {formState.email}
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">
                    Código de verificación
                  </label>
                  <input
                    name="authCode"
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                {resendMessage && (
                  <p className="text-sm text-gray-600">
                    {resendMessage}{" "}
                    {resendTimer > 0 &&
                      `(${resendTimer} segundos restantes para poder solicitar nuevamente)`}
                  </p>
                )}

                {showResendButton && (
                  <button
                    type="button"
                    onClick={(e) => handleResendCode(e, formState.username)}
                    className="w-full text-sm text-terrasacha-primary hover:text-terrasacha-secondary1 transition-colors duration-300"
                  >
                    Reenviar código
                  </button>
                )}

                <button
                  type="submit"
                  onClick={(e) => confirmSignUp(e)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Cargando..." : "Confirmar registro"}
                </button>
              </form>
            </div>
          )}

          {/* Sign In Form */}
          {formType === "signIn" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Inicio de sesión</h2>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Usuario</label>
                  <input
                    name="username"
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={onChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform  text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "ForgotPassword",
                    }))
                  }
                  className="w-full text-sm text-terrasacha-primary hover:text-terrasacha-secondary1 transition-colors duration-300 text-right"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => signIn(e)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Cargando..." : "Ingresar"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-600">¿Necesitas una cuenta? </span>
                <button
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signUp",
                    }))
                  }
                  className="text-terrasacha-primary hover:text-terrasacha-secondary1 font-semibold transition-colors duration-300"
                >
                  Registrarse
                </button>
              </div>
            </div>
          )}

          {/* TOTP Confirmation Form */}
          {formType === "confirmTOTP" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Verificación TOTP</h2>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Código TOTP</label>
                  <input
                    name="totpCode"
                    onChange={onChange}
                    placeholder="Introduce el código TOTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => confirmTOTP(e)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Verificando..." : "Verificar"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signIn",
                    }))
                  }
                  className="text-terrasacha-primary hover:text-terrasacha-secondary1 font-semibold transition-colors duration-300"
                >
                  Regresar a inicio de sesión
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {formType === "ForgotPassword" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Recuperar contraseña</h2>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Usuario</label>
                  <input
                    name="username"
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <p className="text-sm text-gray-600">
                  El código se enviará a la dirección de correo electrónico asociada al usuario
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => forgotPassword(e)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Enviando..." : "Enviar código"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-600">¿Necesita una cuenta? </span>
                <button
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signUp",
                    }))
                  }
                  className="text-terrasacha-primary hover:text-terrasacha-secondary1 font-semibold transition-colors duration-300"
                >
                  Registrarse
                </button>
              </div>
            </div>
          )}

          {/* Confirm Forgot Password Code Form */}
          {formType === "confirmFPcode" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <TerrasachaLogo className="w-48 h-auto mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Confirmar código</h2>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Usuario</label>
                  <input
                    name="username"
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Código</label>
                  <input
                    name="code"
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Nueva contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onFocus={() => setShowPopover(true)}
                    onBlur={() => setTimeout(() => setShowPopover(false), 200)}
                    onChange={onChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>

                  {showPopover && (
                    <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-64 z-10">
                      <strong className="block mb-2">Requisitos de contraseña:</strong>
                      <ul className="space-y-1">
                        <li className={`flex items-center ${passwordValidations.length ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{passwordValidations.length ? "✔" : "✖"}</span>
                          Mínimo 8 caracteres
                        </li>
                        <li className={`flex items-center ${passwordValidations.number ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{passwordValidations.number ? "✔" : "✖"}</span>
                          Al menos 1 número
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => confirmNewPassword(e)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Cargando..." : "Confirmar nueva contraseña"}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {formType === "changePassword" && (
            <div className="bg-white rounded-2xl shadow-terrasacha-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-terrasacha-secondary1">Cambio de contraseña requerido</h2>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <p className="text-sm text-gray-600">
                  {`Para poder ingresar a la plataforma como ${formState.username} primero debe cambiar la contraseña`}
                </p>

                <div className="relative">
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Nueva contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    onChange={handleChange}
                    onFocus={() => setShowPopover(true)}
                    onBlur={() => setTimeout(() => setShowPopover(false), 200)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>

                  {showPopover && (
                    <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-64 z-10">
                      <strong className="block mb-2">Requisitos de contraseña:</strong>
                      <ul className="space-y-1">
                        <li className={`flex items-center ${passwordValidations.length ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{passwordValidations.length ? "✔" : "✖"}</span>
                          Mínimo 8 caracteres
                        </li>
                        <li className={`flex items-center ${passwordValidations.number ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{passwordValidations.number ? "✔" : "✖"}</span>
                          Al menos 1 número
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2">Confirmar contraseña</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terrasacha-primary transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => changePassword(e)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha"
                  }`}
                >
                  {loading ? "Cargando..." : "Cambiar Contraseña"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modales de Términos y Políticas */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms"
        onAccept={handleTermsAccept}
      />
      
      <TermsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        type="privacy"
        onAccept={handlePrivacyAccept}
      />
    </div>
  );
}
