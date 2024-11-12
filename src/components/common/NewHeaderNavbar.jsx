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

export default function NewHeaderNavbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  useEffect(() =>{
    Auth.currentAuthenticatedUser()
    .then(data => setUser(data))
    .catch(err => console.log(err))

  },[])
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
                    <Nav.Link
                      onClick={() => (window.location.href = "/constructor")}
                    >
                      Mis Proyectos
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => (window.location.href = "/new_project")}
                    >
                      Postular proyecto
                    </Nav.Link>
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
                  </>
                )}
                {user.attributes['custom:role'] === "validator" && (
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
                        {user.attributes['custom:role']}
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
    </Navbar>
  );
}
