import React, { useState, useEffect } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { FaCheckCircle, FaHourglassHalf, FaClipboardList, FaProjectDiagram, FaTimesCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ValidationModal from "./ValidationModal"; // ✅ Importamos el modal

export default function Timeline({ currentStep = 1, isFormComplete, onStepChange, propertyStatus }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    console.log("🟢 Abriendo el modal...");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("🔴 Cerrando el modal...");
    setModalIsOpen(false);
  };

  const handleValidationComplete = () => {
    console.log("📌 Todos los archivos han sido subidos correctamente. Pasando al paso 3...");
    onStepChange(3); // ✅ Se pasa al paso 3 en el componente padre
  };

  // ✅ Manejar el paso 4 según el estado del predio
  const isApproved = propertyStatus === "APPROVED";
  const isRejected = propertyStatus === "REJECTED";

  const steps = [
    { id: 1, title: "Predio Inscrito", description: "El predio ha sido registrado.", icon: <FaClipboardList size={18} /> },
    { id: 2, title: "Validación Legal", description: "Revisión de documentos y requisitos.", icon: <FaProjectDiagram size={18} /> },
    { id: 3, title: "Estudio", description: "Análisis técnico y estudios ambientales.", icon: <FaHourglassHalf size={18} /> },
    { 
      id: 4, 
      title: isApproved ? "Predio Aprobado" : isRejected ? "Predio Rechazado" : "Proyecto Elegido", 
      description: isApproved ? "El predio ha sido aprobado." : isRejected ? "El predio ha sido rechazado." : "Aprobación final del predio.", 
      icon: isApproved 
      ? <FaCheckCircle size={18} className="text-white" /> 
      : isRejected 
        ? <FaTimesCircle size={18} className="text-white" /> 
        : <FaCheckCircle size={18} />
    
    },
  ];

  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      <div className="w-full max-w-3xl">
        {/* 📌 Barra de progreso */}
        <ProgressBar
          percent={((currentStep - 1) / (steps.length - 1)) * 100}
          filledBackground="linear-gradient(to right, #34d399, #059669)"
          height={6}
          transitionDuration={800}
        >
          {steps.map((step, index) => (
            <Step key={step.id}>
              {({ accomplished }) => (
                <div className="flex flex-col items-center w-24 text-center relative">
                  
                  {/* 📌 Ícono del paso */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 cursor-pointer shadow-md mb-2
                      ${
                        step.id === 4 
                          ? isApproved
                            ? "bg-green-500 text-white border-green-600 shadow-lg hover:shadow-xl"
                            : isRejected
                            ? "bg-red-500 text-white border-red-600 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 border-gray-400 opacity-50"
                          : accomplished
                            ? "bg-green-500 text-white border-green-600 shadow-lg hover:shadow-xl"
                            : currentStep - 1 === index
                            ? "bg-yellow-500 text-white border-yellow-600 animate-pulse shadow-xl"
                            : "bg-gray-300 text-gray-500 border-gray-400 opacity-50"
                      } ${accomplished || currentStep - 1 === index ? "hover:scale-105" : ""}`}
                    data-tooltip-id={`tooltip-${step.id}`}
                    onClick={() => {
                      if (step.id === 2) {
                        openModal();
                      }
                    }}    
                  >
                    {step.icon}
                  </div>

                  {/* 📌 Línea divisoria debajo del icono */}
                  <div className="w-1 h-6 bg-gray-400"></div>

                  {/* 📌 Tooltip con mejoras */}
                  <Tooltip
                    id={`tooltip-${step.id}`}
                    effect="solid"
                    place="bottom"
                    className="text-xs p-3 bg-black text-white rounded-md shadow-md flex items-center gap-2 animate-fade-in"
                  >
                    {step.id === 1 ? (
                      !isFormComplete ? (
                        <div className="flex items-center gap-2">
                          <FaTimesCircle className="text-red-500" size={14} />
                          <span>Para completar el paso 1, debes llenar toda la información del formulario.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500" size={14} />
                          <span>¡Paso 1 completado!</span>
                        </div>
                      )
                    ) : (
                      <span>{step.description}</span>
                    )}
                  </Tooltip>

                  {/* 📌 Título del paso */}
                  <p
                    className={`mt-2 text-xs font-semibold transition-colors duration-500 ${
                      step.id === 4
                        ? isApproved
                          ? "text-green-600 font-bold"
                          : isRejected
                          ? "text-red-600 font-bold"
                          : "text-gray-500"
                        : accomplished
                        ? "text-green-600"
                        : currentStep - 1 === index
                        ? "text-yellow-600 font-bold"
                        : "text-gray-500"
                    } hover:text-green-500`}
                  >
                    {step.title}
                  </p>
                </div>
              )}
            </Step>
          ))}
        </ProgressBar>
      </div>

      {/* ✅ Modal de Validación Legal */}
      <ValidationModal isOpen={modalIsOpen} onClose={closeModal} onValidationComplete={handleValidationComplete} />
    </div>
  );
}
