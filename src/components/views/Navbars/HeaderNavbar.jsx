import React from 'react';
// Tailwind
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
// Import images
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from "components/Constructor/Navbar/HeaderNavbar.module.css";

export default function CombinedHeaderNavbar() {
  let role = localStorage.getItem("role");

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      window.location.href = window.location.pathname;
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  const findLastAuthUserKey = () => {
    for (let key in localStorage) {
      if (key.includes("CognitoIdentityServiceProvider") && key.includes(".LastAuthUser")) {
        const userlog = localStorage[key];
        return userlog;
      }
    }
    return null;
  };
  
  let userlog = findLastAuthUserKey();
  
  return (
    <Navbar className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
        <NavbarCollapse>
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {role === 'constructor' && (
              <>
                <NavbarLink onClick={() => (window.location.href = "/constructor")}>Mis Proyectos</NavbarLink>
                <NavbarLink onClick={() => (window.location.href = "/new_project")}>Postular proyecto</NavbarLink>
                {/* <NavbarLink onClick={() => (window.location.href = "/creating_wallet")}>¿Cómo crear tu billetera?</NavbarLink> */}
              </>
            )}
            {role === 'validator' && (
              <>
                <NavbarLink onClick={() => (window.location.href = "/validator_admon")}>Proyectos asignados</NavbarLink>
              </>
            )}
            {localStorage.getItem('role') ? (
              <div>
                <button className={s.signing} onClick={() => handleSignOut()}>Desconectar</button>
                <button className='role'>
                  {userlog}<br />
                  <p className='role_btn'>
                    {role === 'validator' ? 'Validador' : (role === 'constructor' ? 'Propietario' : role)}
                  </p>
                </button>
              </div>
            ) : (
              <button className={s.signing} onClick={() => (window.location.href = "/login")}>Conectar</button>
            )}
          </ul>
        </NavbarCollapse>
      </div>
    </Navbar>
  );
}
