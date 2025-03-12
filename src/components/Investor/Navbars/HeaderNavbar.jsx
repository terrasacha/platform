import React, { Component } from "react";
// Bootstrap
import { Container, Nav, Navbar, Modal, Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import s from "./HeaderNavbar.module.css";
// Import images
import LOGO from "../../common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import { BellFill } from "react-bootstrap-icons";

export default class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [], // Inicializar las notificaciones
      showNotifications: false // Estado para mostrar el modal
    };
    this.handleChangeNavBar = this.handleChangeNavBar.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleShowNotifications = this.handleShowNotifications.bind(this);
    this.handleCloseNotifications = this.handleCloseNotifications.bind(this);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        this.setState({ user: data });
      })
      .catch((err) => console.log(err));
  }

  async handleChangeNavBar(pRequest) {
    this.props.changeHeaderNavBarRequest(pRequest);
  }

  async handleSignOut() {
    this.props.logOut();
  }

  handleShowNotifications() {
    const { user } = this.state;
    if (!user) return;

    const role = user.attributes["custom:role"];
    const userId = user.attributes.sub;

    if (role === "validator" || role === "constructor") {
      this.fetchPendingMessages(userId, role);
    }
    this.setState({ showNotifications: true });
  }

  handleCloseNotifications() {
    this.setState({ showNotifications: false });
  }

  async fetchPendingMessages(userId, role) {
    // Aquí puedes incluir la lógica para obtener notificaciones desde la API
    // Por ahora, dejo mensajes de prueba
    const sampleMessages = [
      { id: 1, text: "Nueva verificación pendiente" },
      { id: 2, text: "Comentario agregado a un predio" }
    ];
    this.setState({ messages: sampleMessages });
  }

  render() {
    const { user, messages, showNotifications } = this.state;
    const role = user?.attributes?.["custom:role"] || "";
    const userlog = user?.username || "";

    const roleDisplayNames = {
      admon: "Administrador",
      validator: "Consultor",
      analyst: "Analista",
      constructor: "Propietario",
      legal: "Legal"
    };

    const displayRole = roleDisplayNames[role] || "Sin Rol";

    return (
      <>
        <Navbar key="sm" bg="light" expand="lg" fixed="top">
          <Container>
            <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
              <img src={LOGO} className="w-8 h-auto" alt="ATP" />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Offcanvas placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                  <a href="/">
                    <img src={LOGO} className="w-8 h-auto" alt="ATP" />
                  </a>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
                <Nav>
                  <Nav className={s.navGroup}>
                    {role === "validator" && (
                      <Nav.Link
                        href="#profile"
                        onClick={(e) =>
                          this.props.changeHeaderNavBarRequest("product_documents")
                        }
                        className="flex items-center space-x-4"
                      >
                        {/* Botón Crear Campaña */}
                        <a
                          href="/new_campaign"
                          className="bg-[#4DBC5E] text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition flex items-center justify-center space-x-2"
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span style={{ color: "#FFFFFF" }}>Crear Campaña</span>
                        </a>

                        {/* Ícono de Notificaciones */}
                        <div
                          className="relative cursor-pointer flex items-center"
                          onClick={this.handleShowNotifications}
                          style={{ position: "relative", marginLeft: "10px" }}
                        >
                          <BellFill className="w-6 h-6 text-gray-800" />
                          {messages.length > 0 && (
                            <span
                              className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2"
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-10px",
                                background: "red",
                                color: "white",
                                fontSize: "12px",
                                borderRadius: "50%",
                                padding: "2px 6px",
                              }}
                            >
                              {messages.length}
                            </span>
                          )}
                        </div>
                      </Nav.Link>
                    )}

                    {role ? (
                      <div className="flex">
                        <button className={s.signing} onClick={() => this.handleSignOut()}>
                          Desconectar
                        </button>
                        <button className="role flex flex-col items-center">
                          <p className="role_btn">{displayRole}</p>
                        </button>
                      </div>
                    ) : (
                      <button className={s.signing} onClick={() => (window.location.href = "/login")}>
                        Ingresar
                      </button>
                    )}
                  </Nav>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        {/* MODAL DE NOTIFICACIONES */}
        <Modal show={showNotifications} onHide={this.handleCloseNotifications} centered>
          <Modal.Header closeButton>
            <Modal.Title>Notificaciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {messages.length > 0 ? (
              <ul>
                {messages.map((msg) => (
                  <li key={msg.id}>{msg.text}</li>
                ))}
              </ul>
            ) : (
              <p>No tienes notificaciones pendientes.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseNotifications}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
