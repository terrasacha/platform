import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
  FaClipboardCheck,
  FaClock,
  FaFileSignature,
  FaHandHoldingUsd,
  FaStore,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function TimelineProject({ currentStep = 1, onStepChange }) {
  const steps = [
    {
      id: 1,
      title: "Proyecto creado",
      description: "El proyecto ha sido creado correctamente.",
      icon: <FaClipboardCheck size={18} />, 
    },
    {
      id: 2,
      title: "Cierre de convocatoria",
      description: "Esperando el cierre de la convocatoria de predios.",
      icon: <FaClock size={18} />, 
    },
    {
      id: 3,
      title: "Completar información",
      description: "Debes completar toda la información del proyecto.",
      icon: <FaFileSignature size={18} />, 
    },
    {
      id: 4,
      title: "Condiciones financieras",
      description:
        "Esperando aceptación de condiciones financieras. Si se rechazan, vuelve al paso anterior.",
      icon: <FaHandHoldingUsd size={18} />, 
    },
    {
      id: 5,
      title: "Proyecto subido a marketplace",
      description: "¡Tu proyecto ahora es visible en el marketplace!",
      icon: <FaStore size={18} />, 
    },
  ];

  return (
<div className="w-full flex flex-col items-start mt-6 px-4">
  <div className="w-full max-w-3xl ml-[-40px]">
        <ProgressBar
          percent={((currentStep - 1) / (steps.length - 1)) * 100}
          filledBackground="linear-gradient(to right, #34d399, #059669)"
          height={6}
          transitionDuration={800}
        >
          {steps.map((step) => (
            <Step key={step.id}>
              {({ accomplished }) => {
                let stepClass =
                  "bg-gray-300 text-gray-500 border-gray-400 opacity-50";

                if (step.id === currentStep) {
                  stepClass =
                    "bg-yellow-500 text-white border-yellow-600 animate-pulse shadow-xl";
                } else if (accomplished) {
                  stepClass =
                    "bg-green-500 text-white border-green-600 shadow-lg";
                }

                return (
                  <div className="flex flex-col items-center w-24 text-center relative">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 cursor-pointer shadow-md mb-2 ${stepClass}`}
                      data-tooltip-id={`tooltip-${step.id}`}
                      onClick={() =>
                        typeof onStepChange === "function"
                          ? onStepChange(step.id)
                          : null
                      }
                    >
                      {step.icon}
                    </div>

                    <div className="w-1 h-6 bg-gray-400 mx-auto mt-1"></div>

                    <Tooltip
                      id={`tooltip-${step.id}`}
                      effect="solid"
                      place="bottom"
                      className="text-xs p-3 bg-black text-white rounded-md shadow-md flex items-center gap-2 animate-fade-in"
                    >
                      {step.description}
                    </Tooltip>

                    <p
                      className={`mt-2 text-xs font-semibold transition-colors duration-500 ${
                        step.id === currentStep
                          ? "text-yellow-600 font-bold"
                          : accomplished
                          ? "text-green-600"
                          : "text-gray-500"
                      } hover:text-green-500`}
                    >
                      {step.title}
                    </p>
                  </div>
                );
              }}
            </Step>
          ))}
        </ProgressBar>
      </div>
    </div>
  );
}
