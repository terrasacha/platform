import React from "react";
// Tailwind
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';


// Import images
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from "components/Constructor/Navbar/HeaderNavbar.module.css";


export default function NewHeaderNavbar() {
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
    <Navbar>
        <Navbar.Brand href="/" style={{ marginLeft: "2%" }}>
          <img
            src={LOGO}
            height="40"
            width="auto"
            className="d-inline-block align-top w-10"
            alt="ATP"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
            <Navbar.Collapse >
                {role === "constructor" && (
                  <>
                  <Navbar.Link
                    onClick={() =>
                      (window.location.href = "/constructor")
                    }
                  >
                    Mis Proyectos
                  </Navbar.Link>
                    <Navbar.Link
                      onClick={() =>
                        (window.location.href = "/new_project")
                      }
                    >
                      Postular proyecto
                    </Navbar.Link>
                    {/* <NavbarLink
                      onClick={() =>
                        (window.location.href = "/creating_wallet")
                      }
                    >
                      ¿Cómo crear tu billetera?
                    </NavbarLink> */}
                  </>
                )}
                {role === "validator" && (
                  <>
                    <Navbar.Link
                      onClick={() =>
                        (window.location.href = "/validator_admon")
                      }
                    >
                      Proyectos asignados
                    </Navbar.Link>
                  </>
                )}
                {localStorage.getItem("role") ? (
                  <div>
                    <button className={s.signing} onClick={() => handleSignOut()}>
                      Desconectar
                    </button>
                  <button className='role'>
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
                    Conectar
                  </button>
                )}
              </Navbar.Collapse>
    </Navbar>
  );
}
