import React, { useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
  FaClipboardCheck,
  FaClock,
  FaFileSignature,
  FaHandHoldingUsd,
  FaStore,
  FaQuestionCircle,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Modal, Button } from "react-bootstrap";

export default function TimelineProject({ currentStep = 1 }) {
  const [helpStep, setHelpStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Proyecto creado",
      description: "El proyecto ha sido creado correctamente.",
      helpText: "En este paso se ha completado el registro inicial del proyecto. No requiere más acciones.",
      icon: <FaClipboardCheck size={18} />,
    },
    {
      id: 2,
      title: "Cierre de convocatoria",
      description: "Esperando el cierre de la convocatoria de predios.",
      helpText: "Aquí el proyecto permanece mientras la campaña de inscripción de predios está abierta.",
      icon: <FaClock size={18} />,
    },
    {
      id: 3,
      title: "Completar información",
      description: "Debes completar toda la información del proyecto.",
      helpText: "Incluye datos técnicos, financieros, geográficos y generales del proyecto.",
      icon: <FaFileSignature size={18} />,
    },
    {
      id: 4,
      title: "Condiciones financieras",
      description: "Esperando aceptación de condiciones financieras.",
      helpText: "El propietario debe aceptar las condiciones financieras ofrecidas para continuar.",
      icon: <FaHandHoldingUsd size={18} />,
    },
    {
      id: 5,
      title: "Proyecto subido a marketplace",
      description: "¡Tu proyecto ahora es visible en el marketplace!",
      helpText: "El proyecto cumple todos los requisitos y ha sido publicado en el marketplace.",
      icon: <FaStore size={18} />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-start mt-6 px-2 sm:px-4">
      <div className="w-full max-w-3xl mx-auto sm:ml-[-40px]">
        <ProgressBar
          percent={((currentStep - 1) / (steps.length - 1)) * 100}
          filledBackground="linear-gradient(to right, #849b50, #6e6c35)"
          height={6}
          transitionDuration={800}
        >
          {steps.map((step) => (
            <Step key={step.id}>
              {({ accomplished }) => {
                let stepClass = "bg-gray-300 text-gray-500 border-gray-400 opacity-50";
                let stepStyle = {};
                
                if (step.id === currentStep) {
                  stepClass = "text-white border-2 animate-pulse shadow-xl";
                  stepStyle = { backgroundColor: '#e8d79a', borderColor: '#e8d79a' };
                } else if (accomplished) {
                  stepClass = "text-white border-2 shadow-lg";
                  stepStyle = { backgroundColor: '#849b50', borderColor: '#849b50' };
                } else {
                  stepStyle = { backgroundColor: '#b1c181', borderColor: '#b1c181' };
                }

                return (
                  <div className="flex flex-col items-center w-16 sm:w-20 md:w-24 text-center relative">
                    <div className="relative flex flex-col items-center">
                      {/* Círculo del paso */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 cursor-pointer shadow-md mb-2 ${stepClass}`}
                        style={stepStyle}
                        data-tooltip-id={`tooltip-${step.id}`}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>

                      {/* Ícono de ayuda a la derecha - solo visible en pantallas medianas y grandes */}
                      <span
                        onClick={() => setHelpStep(step)}
                        className="hidden sm:block absolute left-full top-1/2 -translate-y-1/2 ml-2 cursor-pointer"
                        title="Ver explicación del paso"
                        aria-label="Ayuda del paso"
                        data-tooltip-id={`help-tooltip-${step.id}`}
                        data-tooltip-content="Ver explicación del paso"
                      >
                        <FaQuestionCircle size={14} style={{ color: '#6e6c35' }} className="opacity-90 hover:opacity-100" />
                      </span>

                      <Tooltip id={`help-tooltip-${step.id}`} place="top" effect="solid" />
                    </div>

                    <div className="w-1 h-4 sm:h-6 mx-auto mt-1" style={{ backgroundColor: '#b1c181' }}></div>

                    <Tooltip
                      id={`tooltip-${step.id}`}
                      effect="solid"
                      place="bottom"
                      className="text-xs p-3 bg-black text-white rounded-md shadow-md"
                    >
                      {step.description}
                    </Tooltip>

                    <p
                      className={`mt-2 text-xs font-semibold ${
                        step.id === currentStep
                          ? "font-bold"
                          : accomplished
                          ? ""
                          : ""
                      }`}
                      style={{ 
                        color: step.id === currentStep 
                          ? '#e8d79a' 
                          : accomplished 
                            ? '#849b50' 
                            : '#44482c' 
                      }}
                    >
                      {/* Títulos más cortos en móviles */}
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">
                        {step.id === 1 ? "Creado" :
                         step.id === 2 ? "Convocatoria" :
                         step.id === 3 ? "Información" :
                         step.id === 4 ? "Financiero" :
                         "Marketplace"}
                      </span>
                    </p>
                  </div>
                );
              }}
            </Step>
          ))}
        </ProgressBar>
      </div>

      {/* Modal de ayuda */}
      <Modal show={!!helpStep} onHide={() => setHelpStep(null)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderColor: '#b1c181' }}>
          <Modal.Title style={{ color: '#6e6c35' }} className="text-sm sm:text-base">{helpStep?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#44482c' }} className="text-sm sm:text-base">{helpStep?.helpText}</Modal.Body>
        <Modal.Footer style={{ borderColor: '#b1c181' }}>
          <Button 
            variant="secondary" 
            onClick={() => setHelpStep(null)}
            style={{ backgroundColor: '#849b50', borderColor: '#849b50' }}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
