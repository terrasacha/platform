import React, { Component } from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Auth } from "aws-amplify";
import { Dropdown } from "react-bootstrap";

// Import images
import LOGO from "../../common/_images/suan_logo.png";
import s from "./HeaderNavbar.module.css";
import DropDownProjects from "components/common/DropDownProjects";

export default class HeaderNavbar extends Component {

  constructor(props) {
    super(props)
    this.state = {
        user: null
    }
  }
  
  componentDidMount(){
    Auth.currentAuthenticatedUser().then(data => this.setState({user: data})).catch(err => console.log(err))
  }
  async logOut() {
    await Auth.signOut();
    window.location.href = "/";
    localStorage.removeItem("role");
  }

  findLastAuthUserKey() {
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
  }

  render() {
    let role = this.state.user?.attributes['custom:role'] || ''
    let userlog = this.state.user?.username || ''
    return (
      <Navbar key="sm" bg="light" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
            <img src={LOGO} className="w-8 h-auto" alt="ATP" />
          </Navbar.Brand>
          <h1>
            <strong>suan</strong>
          </h1>
          <Navbar.Toggle />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-$'sm'`}
            aria-labelledby={`offcanvasNavbarLabel-expand-$'sm'`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-$'sm'`}>
                <a href="/">
                  {" "}
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
                <Nav className="me-auto">
                  {role === "admon" ? (
                    <Nav.Link onClick={() => (window.location.href = "/admon")}>
                      Administrar
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                 {role === "investor" && (
                    <>
                      <Nav.Link
                        onClick={() =>
                          (window.location.href = "/investor_admon")
                        }
                      >
                        Perfil
                      </Nav.Link>
                      <Nav.Link
                        onClick={() =>
                          (window.location.href = "/PQR")
                        }
                      >
                        PQR
                      </Nav.Link>
                      <Nav.Link
    href="https://suans-organization.gitbook.io/suan"
    target="_blank"
    rel="noopener noreferrer"
  >
    Ayuda
  </Nav.Link>
                    </>
                  )}
                  {role === "validator" && (
                    <>
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = "/validator_admon")
                      }
                    >
                      Perfil
                    </Nav.Link>
                    <Nav.Link
                        onClick={() =>
                          (window.location.href = "/PQR")
                        }
                      >
                        PQR
                      </Nav.Link>
                      <Nav.Link
    href="https://suans-organization.gitbook.io/suan"
    target="_blank"
    rel="noopener noreferrer"
  >
    Ayuda
  </Nav.Link>
                    </>
                  )}
                   {role === "analyst" && (
                    <>
                    <Nav.Link
                        onClick={() =>
                          (window.location.href = "/PQR")
                        }
                      >
                        PQR
                      </Nav.Link>
                      <Nav.Link
                        onClick={() =>
                          (window.location.href = "/project_analyst")
                        } 
                      >
                        Ver Proyectos
                      </Nav.Link>
                      <Nav.Link
    href="https://suans-organization.gitbook.io/suan"
    target="_blank"
    rel="noopener noreferrer"
  >
    Ayuda
  </Nav.Link>
                    </>
                  )}
                  {role === "constructor" && (
                    <>
                    <Nav.Link
                      onClick={() => (window.location.href = "/constructor")}
                    >
                      Perfil
                    </Nav.Link>
                    <Nav.Link
                        onClick={() =>
                          (window.location.href = "/PQR")
                        }
                      >
                        PQR
                      </Nav.Link>
                      <Nav.Link
    href="https://suans-organization.gitbook.io/suan"
    target="_blank"
    rel="noopener noreferrer"
  >
    Ayuda
  </Nav.Link>
                    </>
                  )}
                </Nav>
                <Nav className={s.navGroup}>
                  {/* <Nav.Link href="#home" onClick={() => window.location.href="/"}>Inicio</Nav.Link> */}
                  {/* <Nav.Link href="#products" onClick={() => window.location.href="/products"}>Proyectos</Nav.Link> */}
                  {localStorage.getItem("role") ? (
                    <div >
                      <button
                        className={s.signing}
                        onClick={() => this.logOut()}
                      >
                        Desconectar
                      </button>
                      <button className="role">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                          fill="#fff"
                        >
                          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                        </svg>
                        {userlog}
                        <br></br>
                        <p className="role_btn">
                          {role === "validator"
                            ? "Cnosultor"
                            : role === "constructor"
                            ? "Propietario"
                            : role}
                        </p>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex'}}>
                      <a className="m-2 item-menu" href="#tecnologia">
                        Tecnología
                      </a>
                      <a className="m-2 item-menu" href="#porque">
                        ¿Por qué Suan?
                      </a>
                      <DropDownProjects variant={'secondary'}/>
                      <button
                        className={s.signing}
                        onClick={() => (window.location.href = "/login")}
                      >
                        Ingresar
                      </button>
                    </div>
                  )}
                </Nav>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
