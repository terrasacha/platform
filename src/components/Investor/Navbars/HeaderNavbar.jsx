import React, { Component } from 'react'
// Bootstrap
import {  Container, Nav, Navbar } from 'react-bootstrap'
import Offcanvas from 'react-bootstrap/Offcanvas';
import s from './HeaderNavbar.module.css'
// Import images
import LOGO from '../../common/_images/SuanLogo.png'

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.handleChangeNavBar = this.handleChangeNavBar.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }
    
    async handleChangeNavBar(pRequest) {
        console.log('handleChangeNavBar: ', pRequest)
        this.props.changeHeaderNavBarRequest(pRequest)
    }

    async handleSignOut() {
        this.props.logOut()
    }

    render() {
        let role = localStorage.getItem('role')
        return (
            <>
                <Navbar key='sm' bg="light" expand='lg' fixed="top">
                    <Container>
                            <Navbar.Brand href="/" style={{marginLeft: '2%'}}>
                                <img src={LOGO} 
                                height="40"
                                width="auto"
                                className="d-inline-block align-top"
                                alt="ATP"
                                />
                                </Navbar.Brand>
                                <Navbar.Toggle  />
                                <Navbar.Offcanvas
                                    placement="end"
                                    >
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title >
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
                                            <Nav className={s.navGroup}>
                                            <Nav.Link href="#profile" onClick={(e) => this.props.changeHeaderNavBarRequest('product_documents')}>Proyectos Asignados</Nav.Link>
                                            <Nav.Link style={{fontWeight: '700', color: '#FE4849'}} disabled>{role? role: ''}</Nav.Link>
                                                {localStorage.getItem('role')?
                                                <button className={s.signing} onClick={() => this.handleSignOut()}>Log out</button>:
                                                <button className={s.signing} onClick={() => window.location.href="/login"}>Log In</button>
                                                }
                                            </Nav>

                                        </Nav>
                                    </Offcanvas.Body>
                                </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </>
        )
    }
}
