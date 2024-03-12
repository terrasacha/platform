import React, { Component } from "react";
// Bootstrap
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

import s from "./HeaderNavbar.module.css";
// Import images
import LOGO from "../../common/_images/suan_logo.png";

export default class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChangeNavBar = this.handleChangeNavBar.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  };

  async handleChangeNavBar(pRequest) {
    console.log("handleChangeNavBar: ", pRequest);
    this.props.changeHeaderNavBarRequest(pRequest);
  }

  async handleSignOut() {
    this.props.logOut();
  }

  findLastAuthUserKey() {
    for (let key in localStorage) {
      if (key.includes("CognitoIdentityServiceProvider") && key.includes(".LastAuthUser")) {
        const userlog = localStorage[key];
        return userlog;
      }
    }
    return null;
  }
  

  render() {
    let role = localStorage.getItem("role");
    let userlog = this.findLastAuthUserKey();
    return (
      <>
        <Navbar>
            <NavbarBrand href="/" style={{ marginLeft: "2%" }}>
              <img
                src={LOGO}
                height="40"
                width="auto"
                className="d-inline-block align-top w-10"
                alt="ATP"
              />
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse className={s.navGroup}>
                    <NavbarLink
                      href="#profile"
                      onClick={(e) =>
                        this.props.changeHeaderNavBarRequest(
                          "product_documents"
                        )
                      }
                    >
                      Proyectos Asignados
                    </NavbarLink>

                    {localStorage.getItem("role") ? (
                      <div>

                        <button
                        className={s.signing}
                        onClick={() => this.handleSignOut()}
                        >
                          Desconectar
                        </button>
                        <button className='role'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg> 
                        {userlog}<br></br>              
                        <p className='role_btn'>
                          {role === 'validator' ? 'Validador' : (role === 'constructor' ? 'Propietario' : role)}
                        </p>
                        </button>
                      </div>
                    ) : (
                      <button
                        className={s.signing}
                        onClick={() => (window.location.href = "/login")}
                      >
                        Ingresar
                      </button>
                    )}
                  </NavbarCollapse>
        </Navbar>
      </>
    );
  }
}
