import React, { useEffect, useState } from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import HeaderNavbar from "components/views/Navbars/HeaderNavbar"
import { Dropdown } from "react-bootstrap";
import { useNavigate, Link } from "react-router";
// Import images
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from "components/Constructor/Navbar/HeaderNavbar.module.css";
import { BellFill } from "react-bootstrap-icons";
import { listVerificationComments, verificationsByUserVerifiedID, verificationsByUserVerifierID } from "graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import NotificationsModal from "./NotificationsModal";

export default function NewHeaderNavbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        setUser(data);
        const userId = data.attributes.sub; // Obtener `sub` en lugar de `username`
        const role = data.attributes["custom:role"];
  
        if (["validator", "constructor"].includes(role)) {
          fetchPendingMessages(userId, role);
        }
      })
      .catch((err) => console.log("Error obteniendo usuario:", err));
  }, []);

  const fetchPendingMessages = async (userId, role) => {
    if (!userId || !role) return;
  
    try {
      let messages = [];
  
      if (role === "constructor") {
        const ownerResponse = await API.graphql(
          graphqlOperation(verificationsByUserVerifiedID, { userVerifiedID: userId })
        );
  
        messages = ownerResponse?.data?.verificationsByUserVerifiedID?.items?.flatMap(
          (verification) =>
            verification.verificationComments?.items?.map((comment) => ({
              ...comment,
              senderName: verification.userVerifier?.name || "Desconocido",
              propertyID: verification.propertyFeature?.propertyID || null,  // Agregar nombre del verificador
            })) || []
        ) || [];
  
      } else if (role === "validator") {
        const verifierResponse = await API.graphql(
          graphqlOperation(verificationsByUserVerifierID, { userVerifierID: userId })
        );
  
        messages = verifierResponse?.data?.verificationsByUserVerifierID?.items?.flatMap(
          (verification) =>
            verification.verificationComments?.items?.map((comment) => ({
              ...comment,
              senderName: verification.userVerified?.name || "Desconocido",
              propertyID: verification.propertyFeature?.propertyID || null,  // Agregar nombre del verificador
            })) || []
        ) || [];
      }
  
      // Eliminar duplicados
      const uniqueMessages = Array.from(new Map(messages.map((msg) => [msg.id, msg])).values());
      setMessages(uniqueMessages);
    } catch (error) {
      console.error("❌ Error cargando mensajes pendientes:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      window.location.href = window.location.pathname;
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const findLastAuthUserKey = () => {
    for (let key in localStorage) {
      if (
        key.includes("CognitoIdentityServiceProvider") &&
        key.includes(".LastAuthUser")
      ) {
        const userlog = localStorage[key];
        return userlog;
      }
    }
    return null;
  };

  let userlog = findLastAuthUserKey();

  const handleShowNotifications = () => {
    const role = user?.attributes?.["custom:role"];
    if (role === "validator" || role === "constructor") {
      const userId = user.attributes.sub;
      fetchPendingMessages(userId, role);
    }
    setShowNotifications(true);
  };
  
  const handleCloseNotifications = () => setShowNotifications(false);
  if(!user)return <HeaderNavbar />
  return (
    <Navbar key="sm" bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
          <img src={LOGO} className="w-8 h-auto" alt="ATP" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-$'sm'`}
          aria-labelledby={`offcanvasNavbarLabel-expand-$'sm'`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-$'sm'`}>
              <a href="/">
                <img src={LOGO} className="w-8 h-auto" alt="ATP" />
              </a>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ></Nav>
            <Nav>
              <Nav className={s.navGroup}>
                {(user.attributes['custom:role'] === "constructor" || user.attributes['custom:role'] === "investor") && (
                  <>
                  <button
      onClick={() => navigate("/constructor")}
      className="bg-[#3B82F6] text-white font-semibold px-4 py-2 text-sm rounded-md shadow-md hover:bg-[#2563EB] transition duration-300 flex items-center justify-center"
      style={{
        border: "none",
        boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
        minWidth: "120px",
      }}
    >
      Mis Predios
    </button>
    <Nav.Link onClick={() => navigate("/PQRS")}>PQRS</Nav.Link>

{/* Ícono de Notificaciones para Constructores */}
<div className="relative cursor-pointer" onClick={handleShowNotifications}>
  <BellFill className="w-6 h-6 text-gray-800" />
  {messages.length > 0 && (
    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
      {messages.length}
    </span>
  )}
</div>

                    {/* <Nav.Link
                      onClick={() => (window.location.href = "/new_project")}
                    >
                      Postular proyecto
                    </Nav.Link> */}
                     {/*
                    <Dropdown >
                      <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ paddingLeft: '.7rem'}}>
                        Campañas
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) =>
                            navigate('/new_campaign')
                          }
                        >
                          Crear campaña
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) =>
                            navigate('/campaigns')
                          }
                        >
                          Mis campañas
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    */}
                  </>
                )}
                {user.attributes['custom:role'] === "validator" && (
                  <>
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = "/consultor_admon")
                      }
                    >
                      Mis campañas
                    </Nav.Link>
                    <div className="relative cursor-pointer" onClick={handleShowNotifications}>
                      <BellFill className="w-6 h-6 text-gray-800" />
                          {messages.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                          {messages.length}
                        </span>
                      )}
                    </div>
                  </>
                )}
                {user ? (
                  <div>
                    <button
                      className={s.signing}
                      onClick={() => handleSignOut()}
                    >
                      Desconectar
                    </button>
                    <button className="role">
                      {user.username}
                      <p className="role_btn">
                      {user.attributes["custom:role"] === "validator"
                        ? "Consultor"
                        : user.attributes["custom:role"] === "constructor"
                        ? "Propietario"
                        : user.attributes["custom:role"] === "analyst"
                        ? "Analista"
                        : user.attributes["custom:role"]}
                    </p>
                    </button>
                  </div>
                ) : (
                  <button
                    className={s.signing}
                    onClick={() => (window.location.href = "/login")}
                  >
                    Conectar
                  </button>
                )}
              </Nav>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
      <NotificationsModal
  show={showNotifications}
  onClose={handleCloseNotifications}
  messages={messages}
/>
    </Navbar>
  );
}
