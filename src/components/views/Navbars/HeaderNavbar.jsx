import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import LOGO from '../../common/_images/suan_logo.png';
import s from './HeaderNavbar.module.css';

export default class HeaderNavbar extends Component {
  async logOut() {
    await Auth.signOut();
    window.location.href = '/';
    localStorage.removeItem('role');
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
    let role = localStorage.getItem('role');
    let userlog = this.findLastAuthUserKey();

    return (
      <nav className="bg-light">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <a href='/' className="w-10 flex items-center space-x-3">
                <img
                  src={LOGO}
                  width="40"
                  height="40"
                  className="d-inline-block align-top"
                  alt="ATP"
                />
                <span className="text-2xl font-semibold">suan</span>
              </a>
            </div>

            <button className="lg:hidden">
              {/* Add your offcanvas toggle logic here */}
            </button>

            {/* Offcanvas goes here */}

            <div className="hidden lg:flex space-x-4">
              {role === 'admon' && <a href="/admon" className="text-blue-500">Administrar</a>}
              {role === 'investor' && <a href="/investor_admon" className="text-blue-500">Perfil</a>}
              {role === 'validator' && <a href="/validator_admon" className="text-blue-500">Perfil</a>}
              {role === 'constructor' && <a href="/constructor" className="text-blue-500">Perfil</a>}
            </div>

            <div className={`${s.navGroup} hidden lg:flex space-x-4`}>
              {/* Add your navigation links here */}
            </div>

            {localStorage.getItem('role') ? (
              <div className="flex items-center space-x-2">
                <button onClick={() => this.logOut()} className={`${s.signing} text-white`}>
                  Desconectar
                </button>
                <div className="role text-white flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff">
                    {/* Add your SVG path here */}
                  </svg>
                  <span>{userlog}</span>
                  <p className="role_btn">
                    {role === 'validator' ? 'Validador' : role === 'constructor' ? 'Propietario' : role}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="#tecnologia" className="m-2 text-blue-500">Tecnología</a>
                <a href="#porque" className="m-2 text-blue-500">¿Por qué Suan?</a>
                <a href="https://marketplace.suan.global/" target="_blank" rel="noreferrer" className="m-2 text-blue-500">Proyectos</a>
                <button onClick={() => window.location.href="/login"} className={`${s.signing} text-blue-500`}>
                  Ingresar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
