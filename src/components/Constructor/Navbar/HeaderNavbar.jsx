import React, { Component } from 'react';
import { button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

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
            <Navbar fluid>
                    <Navbar.Brand className="lg:hidden flex items-center p-2 focus:outline-none w-10">
                        <img
                            src={LOGO}
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="ATP"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                            <Navbar.link
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                            </Navbar.link>
                                    <Navbar.link href="#investor_products" onClick={(e) => this.handleChangeNavBar('investor_products')} className="text-gray-800 hover:text-gray-600 mr-4">
                                        Mis Proyectos
                                    </Navbar.link>
                                    <Navbar.link onClick={() => window.location.href="/new_project"} className="text-gray-800 hover:text-gray-600 mr-4">
                                        Nuevo Proyecto
                                    </Navbar.link>
                                    <Navbar.link onClick={() => window.location.href="/creating_wallet"} className="text-gray-800 hover:text-gray-600 mr-4">
                                        ¿Cómo crear tu billetera?
                                    </Navbar.link>
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
                                
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
