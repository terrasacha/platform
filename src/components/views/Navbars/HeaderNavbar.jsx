import React, { Component } from 'react'
// Bootstrap
import { Container, Nav, Navbar } from 'react-bootstrap'
// Import images
import LOGO from '../../common/_images/SuanLogo.png'

export default class HeaderNavbar extends Component {
  render() {
    let role = localStorage.getItem('role')
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
          <img
            src={LOGO}
            width="50"
            height="auto"
            className="d-inline-block align-top"
            alt="BBT"
          /></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" onClick={(e) => this.props.handleChangeRenderView('carousel')}>Inicio</Nav.Link>
              <Nav.Link href="#about_us" onClick={(e) => this.props.handleChangeRenderView('about_us')}>Acerca de</Nav.Link>
              <Nav.Link href="#products" onClick={(e) => this.props.handleChangeRenderView('products')}>Proyectos</Nav.Link>
              {role === 'admon'?<Nav.Link onClick={() => window.location.href="/admon"}>ADMIN</Nav.Link>:''}
              {role === 'investor'?<Nav.Link onClick={() => window.location.href="/investor_admon"}>Profile</Nav.Link>:''}
              {role === 'validator'?<Nav.Link onClick={() => window.location.href="/validator_admon"}>VALIDATOR</Nav.Link>:''}

            </Nav>
            <Nav>
              <Nav.Link style={{fontWeight: '700', color: '#FE4849'}}>{role? role: ''}</Nav.Link>
              <Nav.Link href="#terms_and_conditions" onClick={(e) => this.props.handleChangeRenderView('terms_and_conditions')}>T&C</Nav.Link>
              <Nav.Link eventKey={2} href="#instagram">
                Instagram
              </Nav.Link>
              {localStorage.getItem('role')?
              <button onClick={() => this.props.logOut()}>Log out</button>:
              <button onClick={() => window.location.href="/login"}>Log In</button>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}
