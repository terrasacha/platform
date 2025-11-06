import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGavel } from "react-icons/fa";

export default function LegalBanner() {
  const navigate = useNavigate();

  const handleNavigateToValidation = () => {
    navigate("/legal_admon");
  };

  return (
    <section className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8 overflow-hidden">
      {/* Banner - Aplicando diseño Terrasacha */}
      <div className="bg-gradient-terrasacha-subtle rounded-3xl p-8 md:p-12 shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left mb-10 md:mb-0 md:pr-12 relative z-10">
            <h1 className="text-4xl md:text-5xl font-typographica font-bold text-terrasacha-secondary1 leading-tight">
              Valida{" "}
              <span className="text-terrasacha-primary">predios</span> para un
              futuro sostenible
            </h1>
            <p className="mt-4 text-terrasacha-secondary1 text-lg font-typographica">
              Revisa y valida la documentación legal de los predios, asegura el
              cumplimiento normativo y contribuye a la sostenibilidad validando
              toda la información legal desde un solo lugar.
            </p>
            <button
              onClick={handleNavigateToValidation}
              className="mt-8 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-typographica"
              aria-label="Ir a validación de predios"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigateToValidation();
                }
              }}
            >
              Validar predios
            </button>
          </div>
          {/* Decoracion - Usando colores Terrasacha */}
          <div className="md:w-1/2 relative flex justify-center items-center overflow-hidden">
            <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] overflow-hidden">
              <div className="absolute -bottom-12 -right-16 w-60 h-60 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-terrasacha-light opacity-60"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.7,-59.8C62.2,-51,74.7,-36.5,78.3,-19.9C81.9,-3.3,76.6,15.4,67.7,30.3C58.8,45.2,46.4,56.3,31.7,64.9C17,73.5,-0.1,79.5,-16,77.2C-31.9,74.9,-46.7,64.2,-58.5,51.3C-70.3,38.4,-79.1,23.3,-81.4,7.1C-83.7,-9.1,-79.5,-26.3,-69.5,-40.7C-59.5,-55.1,-43.7,-66.8,-28.1,-71.4C-12.5,-76,-0.6,-73.4,11.8,-69C24.1,-64.6,33.1,-68.5,47.7,-59.8Z"
                    fill="currentColor"
                    transform="translate(100 100) scale(1.2)"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 -left-40 w-52 h-52 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-terrasacha-earth opacity-70"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M52.1,-63.3C66.8,-53.2,77.5,-36.8,79.8,-19.4C82.1,-2,76,16.4,66.1,32.1C56.2,47.8,42.5,60.8,26.5,68.8C10.5,76.8,-7.7,79.8,-25.5,75.4C-43.2,71,-60.5,59.2,-69.7,43.9C-78.9,28.6,-80.1,9.8,-75.9,-6.2C-71.7,-22.2,-62.1,-35.5,-50.3,-46.9C-38.5,-58.3,-24.5,-67.7,-8.7,-70.7C7,-73.7,27.5,-70.5,52.1,-63.3Z"
                    fill="currentColor"
                    transform="translate(100 100) scale(1.1)"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 right-20 w-32 h-32 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-terrasacha-secondary2 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.7,-59.8C62.2,-51,74.7,-36.5,78.3,-19.9C81.9,-3.3,76.6,15.4,67.7,30.3C58.8,45.2,46.4,56.3,31.7,64.9C17,73.5,-0.1,79.5,-16,77.2C-31.9,74.9,-46.7,64.2,-58.5,51.3C-70.3,38.4,-79.1,23.3,-81.4,7.1C-83.7,-9.1,-79.5,-26.3,-69.5,-40.7C-59.5,-55.1,-43.7,-66.8,-28.1,-71.4C-12.5,-76,-0.6,-73.4,11.8,-69C24.1,-64.6,33.1,-68.5,47.7,-59.8Z"
                    fill="currentColor"
                    transform="translate(100 100) scale(1.1)"
                  ></path>
                </svg>
              </div>
              <div
                className="absolute inset-0 bg-cover bg-center rounded-xl shadow-lg"
                style={{
                  backgroundImage: "url('/hexagon_no_white_bg.png')",
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-terrasacha-secondary1 px-6 py-3 rounded-full shadow-lg flex items-center z-10">
                <span className="font-semibold mr-2 text-lg font-typographica">Legal</span>
                <FaGavel className="text-terrasacha-secondary2 text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

