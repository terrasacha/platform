import React, { Component } from 'react';
import Container from '../../ui/Container';
import { Link } from 'react-router-dom';

import LOGO from '../../common/_images/suan_logo.png';
import s from './HeaderNavbar.module.css';

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
    this.props.logOut();
  }

  findLastAuthUserKey() {
    for (let key in localStorage) {
      if (key.includes('CognitoIdentityServiceProvider') && key.includes('.LastAuthUser')) {
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
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <Container>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={LOGO} alt="Logo" className="h-8" />
            </Link>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">
                    Home
                  </Link>
                </li>
                {/* Add other navigation links as needed */}
              </ul>
            </div>
            <div className="hidden md:flex space-x-4">
              {role && (
                <div>
                  <button className={s.signing} onClick={() => this.handleSignOut()}>
                    Desconectar
                  </button>
                  <button className="role">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff">
                      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                    </svg>
                    {userlog}
                    <br></br>
                    <p className="role_btn">
                      {role === 'validator' ? 'Validador' : role === 'constructor' ? 'Propietario' : role}
                    </p>
                  </button>
                </div>
              )}
              {!role && (
                <button className={s.signing} onClick={() => (window.location.href = '/login')}>
                  Ingresar
                </button>
              )}
            </div>
          </div>
        </Container>
      </nav>
    );
  }
}
