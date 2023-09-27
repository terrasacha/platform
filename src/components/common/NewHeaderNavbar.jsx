import React from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

// Import images
import LOGO from "components/common/_images/SuanLogo.png";
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
                    <Nav.Link
                      onClick={() =>
                        (window.location.href = "/creating_wallet")
                      }
                    >
                      ¿Cómo crear tu billetera?
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
                      Proyectos asignados
                    </Nav.Link>
                  </>
                )}
                {localStorage.getItem("role") ? (
                  <button className={s.signing} onClick={() => handleSignOut()}>
                    Desconectar
                  </button>
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
