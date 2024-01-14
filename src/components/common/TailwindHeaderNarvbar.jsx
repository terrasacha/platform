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
    <nav class="tw-bg-white tw-fixed tw-w-full tw-z-20 tw-top-0 tw-start-0">
      <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-mx-auto tw-px-10">
        <a
          href="https://flowbite.com/"
          class="tw-flex tw-items-center tw-space-x-3 rtl:tw-space-x-reverse"
        >
          <img src={LOGO} className="tw-w-6" alt="ATP" />
          <h1 className="tw-text-black">
            <strong>suan</strong>
          </h1>
        </a>
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          class="tw-inline-flex tw-items-center tw-p-2 tw-w-10 tw-h-10 tw-justify-center tw-text-sm tw-text-gray-500 tw-rounded-lg md:tw-hidden"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span class="tw-sr-only">Open main menu</span>
          <svg
            class="tw-w-5 tw-h-5"
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
          class="tw-justify-between tw-hidden tw-w-full md:tw-flex md:tw-w-auto md:tw-order-1 tw-animate-fade-down tw-animate-ease-linear tw-animate-duration-150"
          id="navbar-sticky"
        >
          <ul class="tw-flex tw-flex-col md:tw-p-0 md:tw-space-x-4 md:tw-flex-row md:tw-border-0 tw-text-sm">
            <li>
              <a
                href="#"
                class="tw-block tw-py-2 tw-text-black tw-rounded md:tw-bg-transparent"
                aria-current="page"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#"
                class="tw-block tw-py-2 tw-text-black tw-rounded hover:tw-bg-gray-100 md:hover:tw-bg-transparent"
              >
                Proyectos
              </a>
            </li>
            <li>
              <a
                href="#"
                class="tw-block tw-py-2 tw-text-black tw-rounded hover:tw-bg-gray-100 md:hover:tw-bg-transparent"
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="#"
                class="tw-block tw-py-2 tw-text-black tw-rounded hover:tw-bg-gray-100 md:hover:tw-bg-transparent"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
