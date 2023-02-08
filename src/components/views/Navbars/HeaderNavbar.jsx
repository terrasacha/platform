import React, { Component } from 'react'
// Bootstrap
import { Container, Nav, Navbar } from 'react-bootstrap'
// Import images
import LOGO from '../../common/_images/SuanLogoName.svg'
import s from './HeaderNavbar.module.css'
export default class HeaderNavbar extends Component {
  render() {
    let role = localStorage.getItem('role')
    return (
      <Navbar collapseOnSelect expand="lg" style={{backgroundColor: '#fff'}} fixed="top">
        <Container>
          <Navbar.Brand href="/">
          <img
            src={LOGO}
            width="80"
            height="auto"
            className="d-inline-block align-top"
            alt="BBT"
          /></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {role === 'admon'?<Nav.Link onClick={() => window.location.href="/admon"}>ADMIN</Nav.Link>:''}
              {role === 'investor'?<Nav.Link onClick={() => window.location.href="/investor_admon"}>Profile</Nav.Link>:''}
              {role === 'validator'?<Nav.Link onClick={() => window.location.href="/validator_admon"}>VALIDATOR</Nav.Link>:''}

            </Nav>
            <Nav className={s.navGroup}>
              <Nav.Link href="#home" onClick={(e) => this.props.handleChangeRenderView('carousel')}>Inicio</Nav.Link>
              <Nav.Link href="#products" onClick={(e) => this.props.handleChangeRenderView('products')}>Proyectos</Nav.Link>
              {localStorage.getItem('role')?
              <button className={s.signing} onClick={() => this.props.logOut()}>Log out</button>:
              <button className={s.signing} onClick={() => window.location.href="/login"}>Log In</button>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}
