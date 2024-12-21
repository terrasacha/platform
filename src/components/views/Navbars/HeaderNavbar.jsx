import React, { Component } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LOGO from "../../common/_images/suan_logo.png";
import s from "./HeaderNavbar.module.css";
import DropDownProjects from "components/common/DropDownProjects";

export default class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(data => this.setState({ user: data }))
      .catch(err => console.log(err));
  }

  async logOut() {
    await Auth.signOut();
    window.location.href = "/";
    localStorage.removeItem("role");
  }

  getNavLinksByRole(role) {
    const commonLinks = [
      <Nav.Link href="https://suans-organization.gitbook.io/suan" target="_blank" rel="noopener noreferrer">
        Ayuda
      </Nav.Link>
    ];

    const roleBasedLinks = {
      admon: [
        <Nav.Link onClick={() => window.location.href = "/admon"}>Administrar</Nav.Link>
      ],
      investor: [
        <Nav.Link onClick={() => window.location.href = "/investor_admon"}>Perfil</Nav.Link>,
        <Nav.Link onClick={() => window.location.href = "/PQR"}>PQR</Nav.Link>
      ],
      validator: [
        <Nav.Link onClick={() => window.location.href = "/validator_admon"}>Perfil</Nav.Link>,
        <Nav.Link onClick={() => window.location.href = "/PQR"}>PQR</Nav.Link>
      ],
      analyst: [
        <Nav.Link onClick={() => window.location.href = "/PQR"}>PQR</Nav.Link>,
        <Nav.Link onClick={() => window.location.href = "/project_analyst"}>Ver Proyectos</Nav.Link>
      ],
      constructor: [
        <Nav.Link onClick={() => window.location.href = "/constructor"}>Perfil</Nav.Link>,
        <Nav.Link onClick={() => window.location.href = "/PQR"}>PQR</Nav.Link>
      ]
    };

    return (roleBasedLinks[role] || []).concat(commonLinks);
  }

  render() {
    const { user } = this.state;
    const role = user?.attributes['custom:role'] || '';
    const userlog = user?.username || '';

    return (
      <Navbar bg="light" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
            <img src={LOGO} className="w-8 h-auto" alt="ATP" />
          </Navbar.Brand>
          <h1><strong>suan</strong></h1>
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
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll />
              <Nav>
                {this.getNavLinksByRole(role)}
                {localStorage.getItem("role") ? (
                  <div className="sm:flex sm:ml-5 gap-x-3">
                  <button className={s.signing} onClick={this.logOut}>Desconectar</button>
                  <button className="flex bg-slate-800 text-white px-2 py-1 rounded-md gap-x-1 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff">
                      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                    </svg>
                    <div>
                      {userlog}
                      <p className="role_btn">{role || "Sin Rol"}</p>
                    </div>
                  </button>
                </div>
                
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4">
                  <a className="item-menu block " href="#tecnologia">Tecnología</a>
                  <a className="item-menu" href="#porque">¿Por qué Suan?</a>
                  <DropDownProjects variant="secondary" />
                  <button className="text-green-700 font-bold w-fit" onClick={() => window.location.href = "/login"}>Ingresar</button>
                </div>
                
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
