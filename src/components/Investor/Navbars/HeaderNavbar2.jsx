import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

import s from './HeaderNavbar2.module.css';

import LOGO from '../../common/_images/suan_logo.png';

export default class HeaderNavbar2 extends Component {
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
    let role = localStorage.getItem('role');
    return (
      <Navbar fluid>
          <NavbarBrand href="/" style={{ marginLeft: '2%' }}>
            <img
              src={LOGO}
              height="40"
              width="auto"
              className="d-inline-block align-top"
              alt="ATP"
            />
          </NavbarBrand>
          <NavbarToggle />
           <NavbarCollapse>
                  <NavbarLink onClick={() => window.location.href="/creating_wallet"}>
                    ¿Cómo crear tu billetera?
                  </NavbarLink>
                  {localStorage.getItem('role') ? (
                    <button className={s.signing} onClick={() => this.handleSignOut()}>
                      Desconectar
                    </button>
                  ) : (
                    <button className={s.signing} onClick={() => window.location.href="/login"}>
                      Ingresar
                    </button>
                  )}
                </NavbarCollapse>
      </Navbar>
    );
  }
}
