import { Auth, Hub } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import { createUser } from "../../../graphql/mutations";
import s from "./Login.module.css";
/* import LOGO from "../../common/_images/suan_logo.png"; */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TerrasachaLogo from "components/common/TerrasachaLogo";

const initialFormState = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  authCode: "",
  formType: "signIn",
  terms: false,
  privacy_policy: false,
  role: "investor",
  code: "",
  totpCode: "",
};

export default function LogIn() {
  const [formState, updateFormState] = useState(initialFormState);
  const [signInUserData, setSignInUserData] = useState(null);
  const [user, updateUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState({ username: "" });
  const [explain, setExplain] = useState(
    "Una persona, empresa, fondo u organización que quiere rentabilizar su dinero a través de la creación de riqueza con un componente de impacto y protección del medio ambiente"
  );
  let role = localStorage.getItem("role");

  useEffect(() => {
    /* checkUser() */
    setAuthListener();
  }, []);
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

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      updateUser(user);
      updateFormState(() => ({ ...formState, formType: "signedIn" }));
    } catch (err) {
      // updateUser(null)
    }
  }

  function onChange(e) {
    e.persist();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
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

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/\d/.test(password)) {
      setError("La contraseña debe contener al menos un valor numérico");
      return;
    }

    if (!terms) setError("Debe aceptar términos y condiciones");
    if (!privacy_policy) setError("Debe aceptar la politica de privacidad");
    if (username.length < 1) setError("Debe ingresar un nombre de usuario");
    if (email.length < 1) setError("Debe ingresar un email");
    if (
      password === confirmPassword &&
      password.length > 8 &&
      confirmPassword.length > 8
    ) {
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
        console.log(response, "response");
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
    } else {
      setError(
        "Las contraseñas no coinciden o no cumplen con los requisitos mínimos"
      );
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
      setError("code does not match");
    }
  }

  const handleResendCode = async (e, username) => {
    e.preventDefault();
    const { CodeDeliveryDetails } = await Auth.resendSignUp(username);
    console.log(CodeDeliveryDetails);
    if (CodeDeliveryDetails) notify(`Código enviado a ${formState.email}`);
  };
  async function signIn(e) {
    e.preventDefault();
    const { username, password } = formState;

    try {
      setError("");
      setLoading(true);

      const response = await Auth.signIn(username, password);
      console.log(response, "response");

      if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
        setLoading(false);
        updateUser(response);
        updateFormState(() => ({ ...formState, formType: "changePassword" }));
      } else if (response.challengeName === "SOFTWARE_TOKEN_MFA") {
        // El usuario tiene activado MFA con TOTP
        setLoading(false);
        updateFormState(() => ({ ...formState, formType: "confirmTOTP" }));
        setSignInUserData(response);
        // Aquí debes mostrar un formulario donde el usuario ingrese el código TOTP
      } else {
        updateFormState(() => ({ ...formState, formType: "signedIn" }));
        let currentUser = await Auth.currentAuthenticatedUser();
        currentUser = currentUser.attributes["custom:role"];
        localStorage.setItem("role", currentUser);
      }
    } catch (error) {
      setError("Combination of account name and user name does not exist.");
    }
    setLoading(false);
  }

  async function confirmTOTP(e) {
    e.preventDefault();
    const { totpCode } = formState; // Asegúrate de tener un campo para capturar el código TOTP
    const { username } = formState;
    console.log(signInUserData);
    try {
      setError("");
      setLoading(true);

      const response = await Auth.confirmSignIn(
        signInUserData,
        totpCode,
        "SOFTWARE_TOKEN_MFA"
      );
      console.log(response, "response");

      updateFormState(() => ({ ...formState, formType: "signedIn" }));
      let currentUser = await Auth.currentAuthenticatedUser();
      currentUser = currentUser.attributes["custom:role"];
      localStorage.setItem("role", currentUser);
    } catch (error) {
      console.log(error);
      setError("Invalid TOTP code. Please try again.");
    }
    setLoading(false);
  }

  async function forgotPassword(e) {
    e.preventDefault();
    const { username } = formState;
    try {
      setError("");
      setLoading(true);
      await Auth.forgotPassword(username);
      updateFormState(() => ({ ...formState, formType: "confirmFPcode" }));
    } catch (error) {
      setError("User name does not exist.");
    }
    setLoading(false);
  }
  async function confirmNewPassword(e) {
    e.preventDefault();
    const { username, code, password } = formState;
    try {
      setError("");
      setLoading(true);
      await Auth.forgotPasswordSubmit(username, code, password);
      updateFormState(() => ({ ...formState, formType: "signIn" }));
    } catch (error) {
      setError("El código no es válido.");
    }
    setLoading(false);
  }
  async function changePassword(e) {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = formState;

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError("La nueva contraseña debe contener al menos un valor numérico");
      setLoading(false);
      return;
    }

    try {
      setError("");
      setLoading(true);
      console.log(newPassword, confirmNewPassword);
      if (newPassword === confirmNewPassword) {
        await Auth.completeNewPassword(user, newPassword);
        updateFormState(() => ({ ...formState, formType: "signedIn" }));
      } else {
        setError("Las contraseñas no coinciden.");
      }
    } catch (error) {
      console.log(error);
      setError("Error al cambiar la contraseña.");
    }
    setLoading(false);
  }

  const notify = (text) => {
    toast.success(text, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className={s.container}>
      <ToastContainer />
      <div className={s.firstContainer}>
        <div className={s.info}>
          <h2>Aceleramos la transición hacia un mundo de carbono neutral</h2>
          <p>
            Somos un motor alternativo para facilitar el desarrollo,
            financiación e implementación de proyectos de mitigación de cambio
            climático
          </p>
        </div>
      </div>
      <div className={s.secondContainer}>
        {formType === "signUp" && (
          <div className={s.containerLogin}>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Registro</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <form className={s.inputContainer}>
                <fieldset>
                  <input
                    name="username"
                    onChange={onChange}
                    placeholder="Usuario"
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                  {inputError.username && (
                    <span style={{ color: "red", fontSize: ".8em" }}>
                      {inputError.username}
                    </span>
                  )}
                </fieldset>
                <p
                  style={{
                    color: "#797979",
                    fontSize: ".6em",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  El nombre de usuario no debe contener espacios
                </p>
                <fieldset>
                  <input
                    type="email"
                    name="email"
                    onChange={onChange}
                    placeholder="Example@example.com"
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <fieldset>
                  <input
                    name="password"
                    type="password"
                    onChange={onChange}
                    placeholder="Contraseña"
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <p style={{ color: "#797979", fontSize: ".6em", margin: 0 }}>
                  La contraseña debe constar de más de 8 caracteres y contener
                  por lo menos un valor numérico
                </p>
                <fieldset>
                  <input
                    name="confirmPassword"
                    type="password"
                    onChange={onChange}
                    placeholder="Confirmar contraseña"
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <fieldset>
                  <legend>Rol</legend>
                  <select
                    name="role"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  >
                    <option value="investor">Inversionista</option>
                    <option value="constructor">Propietario</option>
                  </select>
                </fieldset>
                {
                  <p style={{ color: "#797979", fontSize: ".6em" }}>
                    {explain}
                  </p>
                }
                <fieldset className={s.checkbox}>
                  <input
                    type="checkbox"
                    name="terms"
                    onChange={() =>
                      updateFormState(() => ({
                        ...formState,
                        terms: !formState.terms,
                      }))
                    }
                  />
                  <label>
                    Acepto los{" "}
                    <a href="/use_terms" target="_blank">
                      términos de uso
                    </a>
                  </label>
                </fieldset>
                <fieldset className={s.checkbox}>
                  <input
                    type="checkbox"
                    name="privacy_policy"
                    onChange={() =>
                      updateFormState(() => ({
                        ...formState,
                        privacy_policy: !formState.privacy_policy,
                      }))
                    }
                  />
                  <label>
                    Acepto la{" "}
                    <a href="/privacy_policy" target="_blank">
                      Politica de privacidad
                    </a>
                  </label>
                </fieldset>
                <button
                  type="submit"
                  onClick={(e) => signUp(e)}
                  disabled={
                    loading || !formState.terms || !formState.privacy_policy
                  }
                  className="btn-login"
                >
                  {loading ? "Loading" : "Registrarse"}
                </button>
              </form>
              <div className={s.needAccount}>
                ¿Ya tienes una cuenta?{" "}
                <span
                  style={{ cursor: "pointer" }}
                  className="text-[#6e6c35] text-sm font-bold"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signIn",
                    }))
                  }
                >
                  Ingresar
                </span>
              </div>
            </div>
          </div>
        )}
        {formType === "confirmSignUp" && (
          <div className={s.containerLogin}>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Confirmación</h2>
              </div>
              <Alert>Codigo de verificación enviado a {formState.email}</Alert>
              {error && <Alert variant="danger">{error}</Alert>}
              <form className={s.inputContainer}>
                <fieldset>
                  <legend>Codigo de verificación</legend>
                  <input
                    name="authCode"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <span
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    fontSize: ".9em",
                    color: "rgba(77,188,94,1)",
                    textAlign: "end",
                  }}
                  onClick={(e) => handleResendCode(e, formState.username)}
                >
                  Reenviar código
                </span>
                <button
                  type="submit"
                  onClick={(e) => confirmSignUp(e)}
                  disabled={loading}
                >
                  {loading ? "Loading" : "Confirm Sign Up"}
                </button>
              </form>
            </div>
          </div>
        )}
        {formType === "signIn" && (
          <div className={s.containerLogin}>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Inicio de sesión</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <form className={s.inputContainer}>
                <fieldset>
                  <legend>Usuario</legend>
                  <input
                    name="username"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <fieldset>
                  <legend>Contraseña</legend>
                  <input
                    type="password"
                    name="password"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <span
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    fontSize: ".9em",
                    color: "rgba(77,188,94,1)",
                    textAlign: "end",
                  }}
                  className="text-[#6e6c35] text-sm font-bold"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "ForgotPassword",
                    }))
                  }
                >
                  Olvidaste tu contraseña?
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => signIn(e)}
                  className="btn-login"
                >
                  {loading ? "Loading" : "Ingresar"}
                </button>
              </form>
              <div className={s.needAccount}>
                ¿Necesitas una cuenta?{" "}
                <span
                  style={{ cursor: "pointer" }}
                  className="text-[#6e6c35] text-sm font-bold"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signUp",
                    }))
                  }
                >
                  Registrarse
                </span>
              </div>
            </div>
          </div>
        )}
        {formType === "confirmTOTP" && (
          <div className={s.containerLogin}>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Verificación TOTP</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <form className={s.inputContainer}>
                <fieldset>
                  <legend>Código TOTP</legend>
                  <input
                    name="totpCode"
                    onChange={onChange} // Asegúrate de tener la función onChange definida para actualizar el estado
                    className="border-[1px] border-gray-300 rounded-md"
                    placeholder="Introduce el código TOTP"
                  />
                </fieldset>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => confirmTOTP(e)} // Llama al método confirmTOTP cuando se haga submit
                  className="btn-login"
                >
                  {loading ? "Verificando..." : "Verificar"}
                </button>
              </form>
              <div className={s.needAccount}>
                <span
                  style={{ cursor: "pointer" }}
                  className="text-[#6e6c35] text-sm font-bold"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signIn", // Regresa al formulario de inicio de sesión si el usuario desea cancelar
                    }))
                  }
                >
                  Regresar a inicio de sesión
                </span>
              </div>
            </div>
          </div>
        )}

        {formType === "ForgotPassword" && (
          <div>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Recuperar contraseña</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <form className={s.inputContainer}>
                <fieldset>
                  <legend>Nombre de usuario</legend>
                  <input name="username" onChange={onChange} />
                </fieldset>
                <span className={s.forgotPasswordSpan}>
                  La contraseña será enviada al email asociado al usuario
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => forgotPassword(e)}
                >
                  {loading ? "Enviando" : "Enviar nuevo codigo"}
                </button>
              </form>
              <div className={s.needAccount}>
                Necesitas una cuenta?{" "}
                <span
                  style={{ cursor: "pointer" }}
                  className="text-[#6e6c35] text-sm font-bold"
                  onClick={() =>
                    updateFormState(() => ({
                      ...formState,
                      formType: "signUp",
                    }))
                  }
                >
                  Sign Up
                </span>
              </div>
            </div>
          </div>
        )}
        {formType === "confirmFPcode" && (
          <div>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <TerrasachaLogo className={"w-48 h-auto"} />
                <h2 className="text-center mb-4">Confirm code</h2>
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <form className={s.inputContainer}>
                <fieldset>
                  <legend>User Name</legend>
                  <input name="username" onChange={onChange} />
                </fieldset>
                <fieldset>
                  <legend>Code</legend>
                  <input name="code" onChange={onChange} />
                </fieldset>
                <fieldset>
                  <legend>New Password</legend>
                  <input type="password" name="password" onChange={onChange} />
                </fieldset>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => confirmNewPassword(e)}
                >
                  {loading ? "Loading" : "Confirm new password"}
                </button>
              </form>
            </div>
          </div>
        )}
        {formType === "changePassword" && (
          <div>
            <div className={s.containerCard}>
              <div className={s.containerTitle}>
                <h2 className="text-center mb-4">
                  Cambio de contraseña requerido
                </h2>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <form className={s.inputContainer}>
                <p
                  style={{ color: "#797979", fontSize: ".8em" }}
                >{`Para poder ingresar a la plataforma como ${formState.username} primero debe cambiar la contraseña`}</p>
                <fieldset>
                  <legend>Nueva contraseña</legend>
                  <input
                    type="password"
                    name="newPassword"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <fieldset>
                  <legend>Confirmar contraseña</legend>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    onChange={onChange}
                    className="border-[1px] border-gray-300 rounded-md"
                  />
                </fieldset>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={(e) => changePassword(e)}
                >
                  {loading ? "Cargando" : "Cambiar Contraseña"}
                </button>
              </form>
            </div>
          </div>
        )}

        {formType === "signedIn" && (window.location.href = "/")}
      </div>
    </div>
  );
}
