import React, { Component } from 'react';
import Container from '../../ui/Container';
import Nav from '../../ui/Nav';
import Navbar from '../../ui/Navbar';
import Offcanvas from '../../ui/Offcanvas';
import s from './HeaderNavbar.module.css'; // Asegúrate de ajustar la importación del estilo según tu estructura de archivos

// Import images
import LOGO from '../../common/_images/suan_logo.png';

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleChangeNavBar = this.handleChangeNavBar.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    async handleChangeNavBar(pRequest) {
        console.log('handleChangeNavBar: ', pRequest);
        this.props.changeHeaderNavBarRequest(pRequest);
    }

    async handleSignOut() {
        this.props.handleSignOut();
    }

    render() {
        return (
            <nav className="bg-light fixed top-0 w-full">
                <Container fluid>
                    <button className="lg:hidden flex items-center p-2 focus:outline-none">
                        <img
                            src={LOGO}
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="ATP"
                        />
                    </button>
                    <Navbar.Toggle />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-sm`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
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
                                    <a href="#investor_products" onClick={(e) => this.handleChangeNavBar('investor_products')} className="text-gray-800 hover:text-gray-600 mr-4">
                                        Mis Proyectos
                                    </a>
                                    <button onClick={() => window.location.href="/new_project"} className="text-gray-800 hover:text-gray-600 mr-4">
                                        Nuevo Proyecto
                                    </button>
                                    <button onClick={() => window.location.href="/creating_wallet"} className="text-gray-800 hover:text-gray-600 mr-4">
                                        ¿Cómo crear tu billetera?
                                    </button>
                                    {localStorage.getItem('role') ?
                                        <div>
                                            <button onClick={() => this.handleSignOut()} className={`signing ${s.signing}`}>
                                                Desconectar
                                            </button>
                                        </div>
                                        :
                                        <button onClick={() => window.location.href="/login"} className={`signing ${s.signing}`}>
                                            Conectar
                                        </button>
                                    }
                                </Nav>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </nav>
        );
    }
}
