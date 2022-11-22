import React, { Component } from 'react'
// Bootstrap
import { Container, Nav, Navbar } from 'react-bootstrap'
// Import images
import LOGO from '../../common/_images/logo.png'

export default class HeaderNavbar extends Component {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
          <img
            src={LOGO}
            width="100"
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
              {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Nav>
              <Nav.Link href="#terms_and_conditions" onClick={(e) => this.props.handleChangeRenderView('terms_and_conditions')}>T&C</Nav.Link>
              <Nav.Link eventKey={2} href="#instagram">
                Instagram
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}
