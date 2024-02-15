import React from "react";

// Import images
import LOGO from "components/common/_images/suan_logo.png";
import { Auth } from "aws-amplify";

export default function TailwindHeaderNavbar({ navItems }) {
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
      if (
        key.includes("CognitoIdentityServiceProvider") &&
        key.includes(".LastAuthUser")
      ) {
        const userlog = localStorage[key];
        return userlog;
      }
    }
    return null;
  };

  let userlog = findLastAuthUserKey();

  return (
    <nav class="bg-white fixed w-full z-20 top-0 start-0">
      <div class="flex flex-wrap items-center justify-between mx-auto px-10">
        <a
          href="https://flowbite.com/"
          class="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={LOGO} className="w-6" alt="ATP" />
          <h1 className="text-black">
            <strong>suan</strong>
          </h1>
        </a>
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            ></path>
          </svg>
        </button>
        <div
          class="justify-between hidden w-full md:flex md:w-auto md:order-1 animate-fade-down animate-ease-linear animate-duration-150"
          id="navbar-sticky"
        >
          <ul class="flex flex-col md:p-0 md:space-x-4 md:flex-row md:border-0 text-sm">
            <li>
              <a
                href="#tecnologia"
                class="block py-2 text-black rounded md:bg-transparent"
                aria-current="page"
              >
                Tecnología
              </a>
            </li>
            <li>
              <a
                href="#porque"
                class="block py-2 text-black rounded md:bg-transparent"
                aria-current="page"
              >
                ¿Por qué Suan?
              </a>
            </li>
            <li>
              <a
                href="https://marketplace.suan.global/" target="_blank" class="block py-2 text-black rounded hover:bg-gray-100 md:hover:bg-transparent">
                Proyectos
              </a>
            </li>
            <li>
              <a href="/login" class="HeaderNavbar_signing__I+fQ7">Ingresar</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
