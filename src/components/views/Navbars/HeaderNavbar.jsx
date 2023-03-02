import React, { Component } from 'react'
// Bootstrap
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

// Import images
import LOGO from '../../common/_images/SuanLogo.png'
import s from './HeaderNavbar.module.css'
export default class HeaderNavbar extends Component {
  render() {
    let role = localStorage.getItem('role')
    return (
      <Navbar key='sm' bg="light" expand='sm' fixed="top">
          <Container fluid>
            <Navbar.Brand href="/" style={{marginLeft: '2%'}}>
                <img src={LOGO} 
                            width="40"
                            height="auto"
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
                            height="auto"
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
              {role === 'admon'?<Nav.Link onClick={() => window.location.href="/admon"}>ADMIN</Nav.Link>:''}
              {role === 'investor'?<Nav.Link onClick={() => window.location.href="/investor_admon"}>Profile</Nav.Link>:''}
              {role === 'validator'?<Nav.Link onClick={() => window.location.href="/validator_admon"}>VALIDATOR</Nav.Link>:''}
              {role === 'constructor'?<Nav.Link onClick={() => window.location.href="/constructor"}>Profile</Nav.Link>:''}

            </Nav>
            <Nav className={s.navGroup}>
              <Nav.Link href="#home" onClick={() => window.location.href="/"}>Inicio</Nav.Link>
              {/* <Nav.Link href="#products" onClick={() => window.location.href="/products"}>Proyectos</Nav.Link> */}
              {localStorage.getItem('role')?
              <button className={s.signing} onClick={() => this.props.logOut()}>Log out</button>:
              <button className={s.signing} onClick={() => window.location.href="/login"}>Log In</button>
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