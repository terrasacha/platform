import React, { Component } from 'react';
//Tailwind
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

import { Auth } from 'aws-amplify';

// Import images
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
      <Navbar fluid>
            <Navbar.Brand href="/" style={{marginLeft: '2%'}}>
                <img src={LOGO} 
                            width="auto"
                            height="40"
                            className="d-inline-block align-top w-10"
                            alt="ATP"
                            />
                            <h1><strong className='text-black'>suan</strong></h1>
            </Navbar.Brand>
          <Navbar.Toggle  />
          <Navbar.Collapse>
              {role === 'admon'?<Navbar.Link onClick={() => window.location.href="/admon"}>Administrar</Navbar.Link>:''}
              {role === 'investor'?<Navbar.Link onClick={() => window.location.href="/investor_admon"}>Perfil</Navbar.Link>:''}
              {role === 'validator'?<Navbar.Link onClick={() => window.location.href="/validator_admon"}>Perfil</Navbar.Link>:''}
              {role === 'constructor'?<Navbar.Link onClick={() => window.location.href="/constructor"}>Perfil</Navbar.Link>:''}

            <Navbar.Link className={s.navGroup}>
              {/* <Nav.Link href="#home" onClick={() => window.location.href="/"}>Inicio</Nav.Link> */}
              {/* <Nav.Link href="#products" onClick={() => window.location.href="/products"}>Proyectos</Nav.Link> */}
              {localStorage.getItem('role')?
              <div>
                <button className={s.signing} onClick={() => this.logOut()}>Desconectar</button>
                <button className='role'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#fff"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg> 
                {userlog}<br></br>              
                 <p className='role_btn'>
                  {role === 'validator' ? 'Validador' : (role === 'constructor' ? 'Propietario' : role)}
                </p>
                </button>
              </div>:
              <div>
                <a className='m-2 item-menu' href='#tecnologia' >Tecnología</a>
                <a className='m-2 item-menu' href='#porque' >¿Por qué Suan?</a>
                <a className='m-2 item-menu' href='https://marketplace.suan.global/' target='_blank' rel='noreferrer' >Proyectos</a>
                <button className={s.signing} onClick={() => window.location.href="/login"}>Ingresar</button>
              </div>
              }
            </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}