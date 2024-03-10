import React, { useState } from "react";
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";
import s from "./HeaderNavbar.module.css";

export default function HeaderNavbar({ changeHeaderNavBarRequest }) {
  const role = localStorage.getItem("role");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleChangeNavBar = async (pRequest) => {
    console.log("handleChangeNavBar: ", pRequest);
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
          className="flex items-center p-2 focus:outline-none"
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
        <div className="lg:hidden">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-gray-800 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:items-center space-x-4">
          {!role && (
            <>
              <a href="#tecnologia" className="text-black hover:text-gray-600">
                Tecnología
              </a>
              <a href="#porque" className="text-black hover:text-gray-600">
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
          {role === "constructor" && (
            <>
              <a
                href="/constructor"
                className="text-gray-800 hover:text-gray-600"
                onClick={() => handleChangeNavBar("investor_products")}
              >
                Mis Proyectos
              </a>
              <button
                onClick={() => (window.location.href = "/new_project")}
                className="text-gray-800 hover:text-gray-600"
              >
                Nuevo Proyecto
              </button>
              <button
                onClick={() => (window.location.href = "/creating_wallet")}
                className="text-gray-800 hover:text-gray-600"
              >
                ¿Cómo crear tu billetera?
              </button>
            </>
          )}
          {role === "validator" && (
            <div>
              <a
                href="#profile"
                onClick={(e) =>
                  changeHeaderNavBarRequest ("product_documents")
                }
              >
                Proyectos Asignados
              </a>
            </div>
          )}
          {role === "admon" && (
            <div className="hidden md:flex space-x-4 relative">
              <button className="block py-2 px-4 text-gray-700 hover:bg-gray-200 focus:outline-none">
                <span>Proyectos</span>
              </button>
              <button className="block py-2 px-4 text-gray-700 hover:bg-gray-200 focus:outline-none">
                <span>Documentos</span>
              </button>
              <button className="block py-2 px-4 text-gray-700 hover:bg-gray-200 focus:outline-none">
                <span>Fórmulas</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-200 focus:outline-none"
                >
                  <span>Project Features</span>
                </button>

                <div
                  className={`absolute top-full left-0 mt-2 space-y-2 bg-white border border-gray-200 rounded-md shadow-md ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <a
                    href="/items"
                    onClick={(e) =>
                      this.changeHeaderNavBarRequest("items", e)
                    }
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
                  >
                    <span>Items de Proyectos</span>
                  </a>
                  <a
                    href="/features"
                    onClick={(e) =>
                      this.changeHeaderNavBarRequest("features", e)
                    }
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
                  >
                    <span>Features</span>
                  </a>
                  <a
                    href="/uom"
                    onClick={(e) => this.changeHeaderNavBarRequest("uom", e)}
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
                  >
                    <span>UOM</span>
                  </a>
                </div>
              </div>
            </div>
          )}

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
              onClick={() => (window.location.href = "/login")}
              className={`signing ${s.signing} hover:text-gray-600`}
            >
              Conectar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
