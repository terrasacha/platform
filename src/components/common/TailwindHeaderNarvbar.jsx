import React from "react";
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from './HeaderNavbar.module.css';

export default function HeaderNavbar({ changeHeaderNavBarRequest }) {
  const role = localStorage.getItem("role");

  const handleChangeNavBar = async (pRequest) => {
    console.log('handleChangeNavBar: ', pRequest);
    changeHeaderNavBarRequest(pRequest);
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      window.location.href = window.location.pathname;
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <nav className="bg-light fixed top-0 w-full">
      <div className="flex items-center justify-between mx-auto p-2 lg:p-4">
        <button
          className=" flex items-center p-2 focus:outline-none"
          onClick={() => handleChangeNavBar(true)}
        >
          <img
            src={LOGO}
            width="40"
            height="40"
            className="d-inline-block align-top logo"
            alt="ATP"
          />
        </button>
        <div className="hidden lg:flex lg:items-center space-x-4">
          {!role && (
            <>
              <a
                href="#tecnologia"
                className="text-black hover:text-gray-600"
              >
                Tecnología
              </a>
              <a
                href="#porque"
                className="text-black hover:text-gray-600"
              >
                ¿Por qué Suan?
              </a>
              <a
                href="https://marketplace.suan.global/"
                className="text-black hover:text-gray-600"
                target="_blank"
              >
                Proyectos
              </a>
            </>
          )}
          {role === 'constructor' && (
            <>
              <a
                href="/constructor"
                className="text-gray-800 hover:text-gray-600"
                onClick={() => handleChangeNavBar('investor_products')}
              >
                Mis Proyectos
              </a>
              <button
                onClick={() => window.location.href="/new_project"}
                className="text-gray-800 hover:text-gray-600"
              >
                Nuevo Proyecto
              </button>
              <button
                onClick={() => window.location.href="/creating_wallet"}
                className="text-gray-800 hover:text-gray-600"
              >
                ¿Cómo crear tu billetera?
              </button>
            </>
          )}
        </div>
        {role ? (
          <div>
            <button
              onClick={() => handleSignOut()}
              className={`signing ${s.signing} hover:text-gray-600`}
            >
              Desconectar
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.location.href="/login"}
            className={`signing ${s.signing} hover:text-gray-600`}
          >
            Conectar
          </button>
        )}
      </div>
    </nav>
  );
}
