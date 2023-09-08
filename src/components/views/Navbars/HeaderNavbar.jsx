import React, { Component } from 'react'
// Bootstrap
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Auth } from 'aws-amplify'

// Import images
import LOGO from '../../common/_images/SuanLogo.png'
import s from './HeaderNavbar.module.css'
export default class HeaderNavbar extends Component {
  async logOut(){
    await Auth.signOut()
    window.location.href="/"
    localStorage.removeItem('role')
  }
  render() {
    let role = localStorage.getItem('role')
    return (
      <Navbar key='sm' bg="light" expand='sm' >
          <Container fluid>
            <Navbar.Brand href="/" style={{marginLeft: '2%'}}>
                <img src={LOGO} 
                            width="auto"
                            height="40"
                            className="d-inline-block align-top"
                            alt="ATP"
                            />
            </Navbar.Brand>
          <Navbar.Toggle  />
          <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-$'sm'`}
              aria-labelledby={`offcanvasNavbarLabel-expand-$'sm'`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-$'sm'`}>
                <a href='/'><img src={LOGO} 
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="ATP"
                /></a>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                >
                </Nav>
                <Nav>
                <Nav className="me-auto">
              {role === 'admon'?<Nav.Link onClick={() => window.location.href="/admon"}>Administrar</Nav.Link>:''}
              {role === 'investor'?<Nav.Link onClick={() => window.location.href="/investor_admon"}>Perfil</Nav.Link>:''}
              {role === 'validator'?<Nav.Link onClick={() => window.location.href="/validator_admon"}>Perfil</Nav.Link>:''}
              {role === 'constructor'?<Nav.Link onClick={() => window.location.href="/constructor"}>Perfil</Nav.Link>:''}

            </Nav>
            <Nav className={s.navGroup}>
              {/* <Nav.Link href="#home" onClick={() => window.location.href="/"}>Inicio</Nav.Link> */}
              {/* <Nav.Link href="#products" onClick={() => window.location.href="/products"}>Proyectos</Nav.Link> */}
              {localStorage.getItem('role')?
              <button className={s.signing} onClick={() => this.logOut()}>Desconectar</button>:
              <button className={s.signing} onClick={() => window.location.href="/login"}>Ingresar</button>
              }
            </Nav>

                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
      </Navbar>
    )
  }
}