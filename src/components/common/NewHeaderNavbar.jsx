import React from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

// Import images
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from "components/Constructor/Navbar/HeaderNavbar.module.css";
export default function NewHeaderNavbar() {
  let role = localStorage.getItem("role");

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      window.location.href = window.location.pathname;
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <Navbar key="sm" bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
          <img
            src={LOGO}
            height="40"
            width="auto"
            className="d-inline-block align-top"
            alt="ATP"
          />
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
                <img
                  src={LOGO}
                  width="40"
                  height="40"
                  className="d-inline-block align-top"
                  alt="ATP"
                />
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
                {role === "constructor" && (
                  <>
                  <Nav.Link
                    onClick={() =>
                      (window.location.href = "/constructor")
                    }
                  >
                    Mis Proyectos
                  </Nav.Link>
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = "/new_project")
                      }
                    >
                      Postular proyecto
                    </Nav.Link>
                    {/* <Nav.Link
                      onClick={() =>
                        (window.location.href = "/creating_wallet")
                      }
                    >
                      ¿Cómo crear tu billetera?
                    </Nav.Link> */}
                  </>
                )}
                {role === "validator" && (
                  <>
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = "/validator_admon")
                      }
                    >
                      Proyectos asignados
                    </Nav.Link>
                  </>
                )}
                {localStorage.getItem("role") ? (
                  <div>
                    <button className={s.signing} onClick={() => handleSignOut()}>
                      Desconectar
                    </button>
                    <button className='role'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                    {role === 'validator' ? 'Validador' : (role === 'constructor' ? 'Propietario' : role)}
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
    </Navbar>
  );
}
