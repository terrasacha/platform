import React, { useEffect, useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaClipboardList,
  FaProjectDiagram,
  FaUpload,
  FaTimesCircle,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ValidationModal from "./ValidationModal";
import PropertyChat from "components/Legal/PropertyChat";
import { API, graphqlOperation } from "aws-amplify";
import { Modal } from "react-bootstrap";
import { createPropertyFeature, createVerification, updateVerification } from "graphql/mutations";
import { listPropertyFeatures, listVerifications } from "graphql/queries";
import { useAuth } from "context/AuthContext";
import ConstructorWorkflow from "./ConstructorWorkflow";
import StepHelpModal from "./StepHelpModal";
import { FaQuestionCircle } from "react-icons/fa";

export default function Timeline({
  currentStep = 1,
  isFormComplete,
  onStepChange,
  propertyStatus,
  propertyId,
  userId, 
  campaignOwnerId,
  openChatOnLoad=false,
  chatTarget,
  onOpenValidationModal, // 🔴 Callback para ValidationModal
  onOpenConstructorWorkflow // 🔴 Nuevo callback para ConstructorWorkflow
}) {
  // ✅ DEBUG: Log para verificar el currentStep recibido
  console.log("📌 Timeline - currentStep recibido:", currentStep);
  const [propertyFeatureID, setPropertyFeatureID] = useState(null);
  const [propertyVerificationID, setPropertyVerificationID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpStep, setHelpStep] = useState(null); // null o el step actual
  const openHelp = (step) => setHelpStep(step);
  const closeHelp = () => setHelpStep(null);

  const { user } = useAuth();

  // ✅ DEBUG: Monitorear cambios en currentStep
  useEffect(() => {
    console.log("📌 Timeline - currentStep cambió a:", currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (!openChatOnLoad || !chatTarget) return;
  
    if (chatTarget === "legal" ) {
      // 🔴 En lugar de abrir el modal directamente, llamamos al callback
      if (onOpenValidationModal) {
        onOpenValidationModal();
      }
    }
  
    if (chatTarget === "validator" ) {
      handleChatFeature(); // Abrir PropertyChat
    }
  }, [openChatOnLoad, currentStep, chatTarget, onOpenValidationModal]);
  
  useEffect(() => {
    if (propertyId) {
      checkExistingFeature();
    }
  }, [propertyId]);
  
  const checkExistingFeature = async () => {
    try {
      if (!propertyId) return;
  
      const response = await API.graphql(
        graphqlOperation(listPropertyFeatures, {
          filter: {
            propertyID: { eq: propertyId },
            featureID: { eq: "GLOBAL_PROPERTY_CHAT" },
          },
        })
      );
  
      const existingFeature = response?.data?.listPropertyFeatures?.items?.[0];
  
      if (existingFeature) {
        setPropertyFeatureID(existingFeature.id);
        setPropertyVerificationID(existingFeature?.verification?.id || null);
      } else {
        console.warn(`⚠️ No se encontró PropertyFeature para propertyId=${propertyId}`);
        setPropertyFeatureID(null);
        setPropertyVerificationID(null);
      }
    } catch (error) {
      console.error("❌ Error al verificar PropertyFeature:", error);
    }
  };
   
  const openModal = (stepId) => {
    if (stepId === 2) {
      // 🔴 En lugar de abrir el modal directamente, llamamos al callback
      if (onOpenValidationModal) {
        onOpenValidationModal();
      }
    }
    if (stepId === 4) {
      // 🔴 Solo permitir abrir ConstructorWorkflow si estás en el paso 4
      if (currentStep === 4 && onOpenConstructorWorkflow) {
        onOpenConstructorWorkflow();
      }
      // Si no estás en el paso 4, simplemente no hacer nada
    }
  };

  const handleValidationComplete = () => {
    console.log("📌 Documentos subidos correctamente. Pasando al paso 3...");
    onStepChange(3);
  };

  const isApproved = propertyStatus === "APPROVED";
  const isRejected = propertyStatus === "REJECTED";

 const steps = [
  {
    id: 1,
    title: "Predio Inscrito",
    description: "El predio ha sido registrado.",
    helpText: "Por favor, diligencia el formulario con la información disponible y guarda los cambios para continuar con el siguiente paso.",
    icon: <FaClipboardList size={18} />,
  },
  {
    id: 2,
    title: "Documentación Legal",
    description: "Carga de documentos para validación.",
    helpText: "Aquí se debe subir la documentación legal obligatoria, como escrituras, certificados y planos catrastales. La revisión inicia después de completarlo.",
    icon: <FaUpload size={18} />,
  },
  {
    id: 3,
    title: "Validación Legal",
    description: "Revisión de documentos y requisitos.",
    helpText: "Un equipo legal revisa la documentación enviada para verificar su autenticidad, validez y cumplimiento de requisitos.",
    icon: <FaProjectDiagram size={18} />,
  },
  {
    id: 4,
    title: "Estudio",
    description: "Análisis técnico y estudios ambientales.",
    helpText: "Se realizan estudios técnicos, como análisis de suelo, uso del suelo, impacto ambiental y viabilidad del predio para el proyecto.",
    icon: <FaHourglassHalf size={18} />,
  },
  {
    id: 5,
    title: isApproved ? "Predio Aprobado" : isRejected ? "Predio Rechazado" : "Proyecto Elegido",
    description: isApproved ? "El predio ha sido aprobado." : isRejected ? "El predio ha sido rechazado." : "Aprobación final del predio.",
    helpText: isApproved
      ? "El predio ha cumplido con todos los requisitos y ha sido aprobado para continuar en el proceso."
      : isRejected
      ? "El predio no cumplió con los requisitos técnicos o legales y ha sido rechazado. Puede reiniciar el proceso si se corrigen los errores."
      : "Se ha seleccionado el predio para integrar el proyecto. Inicia la siguiente etapa del proyecto. Debes esperar que se cierre la campaña y aceptar la propuesta financiera ",
    icon: isApproved ? (
      <FaCheckCircle size={18} className="text-white" />
    ) : isRejected ? (
      <FaTimesCircle size={18} className="text-white" />
    ) : (
      <FaCheckCircle size={18} />
    ),
  },
];

  const handleChatFeature = async () => {
    try {
      if (currentStep !== 4) {
        console.warn("⚠️ El chat solo puede abrirse en el paso 4.");
        return;
      }
      
      if (!propertyId || !userId) {
        console.error("❌ propertyId o userId no están definidos.");
        return;
      }
  
      if (propertyFeatureID) {
        console.log("✅ PropertyFeature ya existe. Verificando actualización de Verification...");
  
        if (propertyVerificationID && campaignOwnerId) {
          console.log("🔍 Obteniendo Verification actual...");
          const response = await API.graphql(
            graphqlOperation(listVerifications, {
              filter: { id: { eq: propertyVerificationID } },
            })
          );
  
          const currentVerification = response?.data?.listVerifications?.items?.[0];
  
          if (currentVerification) {
            console.log("✅ Verification encontrada:", currentVerification);
  
            // Solo actualizar si userVerifierID es null o diferente del campaignOwnerId
            if (!currentVerification.userVerifierID || currentVerification.userVerifierID !== campaignOwnerId) {
              console.log("🔄 Actualizando Verification con userVerifierID:", campaignOwnerId);
              await API.graphql(
                graphqlOperation(updateVerification, {
                  input: {
                    id: propertyVerificationID,
                    userVerifierID: campaignOwnerId,
                  },
                })
              );
            } else {
              console.log("⚠️ No es necesario actualizar, userVerifierID ya está asignado correctamente.");
            }
          } else {
            console.warn("⚠️ No se encontró Verification asociada a esta PropertyFeature.");
          }
        }
  
        // 🔴 En lugar de abrir el modal directamente, llamamos al callback
        if (onOpenConstructorWorkflow) {
          onOpenConstructorWorkflow();
        }
        return;
      }
  
      setIsLoading(true);
  
      console.log("🛠 Creando nuevo PropertyFeature...");
  
      const propertyFeatureInput = {
        propertyID: propertyId,
        featureID: "GLOBAL_PROPERTY_CHAT",
      };
  
      const propertyFeatureResponse = await API.graphql(
        graphqlOperation(createPropertyFeature, { input: propertyFeatureInput })
      );
  
      const newPropertyFeatureID = propertyFeatureResponse.data.createPropertyFeature.id;
      setPropertyFeatureID(newPropertyFeatureID);
  
      console.log("🛠 Creando Verification...");
  
      const verificationInput = {
        userVerifiedID: userId,
        propertyFeatureID: newPropertyFeatureID,
      };
  
      const verificationResponse = await API.graphql(
        graphqlOperation(createVerification, { input: verificationInput })
      );
  
      setPropertyVerificationID(verificationResponse.data.createVerification.id);
  
      if (campaignOwnerId) {
        console.log("🔄 Asignando campaignOwnerId como userVerifierID...");
        await API.graphql(
          graphqlOperation(updateVerification, {
            input: {
              id: verificationResponse.data.createVerification.id,
              userVerifierID: campaignOwnerId,
            },
          })
        );
      }
  
      // 🔴 En lugar de abrir el modal directamente, llamamos al callback
      if (onOpenConstructorWorkflow) {
        onOpenConstructorWorkflow();
      }
      console.log("✅ PropertyFeature y Verification creados con éxito.");
    } catch (error) {
      console.error("❌ Error al crear PropertyFeature y Verification:", error);
    } finally {
      setIsLoading(false);
    }
  };
   
  return (
    <>
      <div className="w-full flex flex-col items-center mt-6 px-4">
        <div className="w-full max-w-4xl">
          <ProgressBar
            percent={((currentStep - 1) / (steps.length - 1)) * 100}
            filledBackground="linear-gradient(135deg, #6e6c35 0%, #849b50 100%)"
            height={8}
            transitionDuration={800}
            className="rounded-full shadow-terrasacha-lg"
          >
            {steps.map((step, index) => (
              <Step key={step.id}>
                {({ accomplished }) => {
                  let stepClass = "bg-terrasacha-light/80 text-terrasacha-secondary1 border-terrasacha-light/60 opacity-60 backdrop-blur-sm";

                  // 🔥 Si es el paso actual, se pone con el color primario de Terrasacha
                  if (step.id === currentStep && step.id !== steps.length) {
                    stepClass = "bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary1 text-white border-terrasacha-primary shadow-terrasacha-2xl animate-pulse-terrasacha";
                  }
                  else if (accomplished) {
                    stepClass = "bg-gradient-to-br from-terrasacha-success to-green-600 text-white border-terrasacha-success shadow-terrasacha-xl hover:shadow-terrasacha-2xl transform hover:scale-105 transition-all duration-300";
                  }

                  // 🔥 Animación especial para el paso 2 (resplandor y pulsación)
                  const isStep2Active = step.id === 2 && currentStep === 2;
                  const glowEffect = isStep2Active
                    ? "animate-pulse ring-4 ring-terrasacha-earth/50 shadow-terrasacha-2xl"
                    : "";

                  return (
                    <div className="flex flex-col items-center w-28 text-center relative">
                      {/* 📌 Flecha animada SOLO para el paso 2 */}
                      {isStep2Active && (
                        <div className="absolute -top-8 text-terrasacha-primary text-lg font-typographica font-bold animate-bounce">
                          <div className="bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary1 text-white px-2 py-1 rounded-lg shadow-terrasacha-lg">
                            ⬇️
                          </div>
                          <p className="text-xs font-typographica font-semibold text-terrasacha-primary mt-1">clic</p>
                        </div>
                      )}

                      {/* 📌 Ícono del paso con animación especial para el paso 2 */}
                      <div className="flex flex-col items-center">
                        <div className="relative flex flex-col items-center">
                          {/* Ícono principal del paso */}
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer ${stepClass} ${glowEffect}`}
                            data-tooltip-id={`tooltip-${step.id}`}
                            onClick={() => openModal(step.id)}
                          >
                            {step.icon}
                          </div>

                          {/* Ícono de ayuda alineado a la derecha del círculo */}
                          <span
                            onClick={() => openHelp(step)}
                            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:opacity-100"
                            title="Ver explicación del paso"
                            aria-label="Ayuda del paso"
                          >
                            <div className="bg-gradient-to-br from-terrasacha-primary/20 to-terrasacha-secondary1/20 p-1 rounded-full border border-terrasacha-primary/30">
                              <FaQuestionCircle size={16} className="text-terrasacha-primary" />
                            </div>
                          </span>

                          <Tooltip id={`help-tooltip-${step.id}`} place="top" effect="solid" />
                        </div>
                      </div>

                      <div className="w-1 h-8 bg-gradient-to-b from-terrasacha-light/60 to-transparent mx-auto mt-2 rounded-full"></div>

                      <Tooltip
                        id={`tooltip-${step.id}`}
                        effect="solid"
                        place="bottom"
                        className="text-xs p-4 bg-gradient-to-br from-terrasacha-secondary1 to-terrasacha-primary text-white rounded-xl shadow-terrasacha-2xl flex items-center gap-2 animate-fade-in font-typographica max-w-xs border border-terrasacha-light/20"
                      >
                        {step.id === 1 ? (
                          !isFormComplete ? (
                            <div className="flex items-center gap-2">
                              <FaTimesCircle className="text-red-400" size={14} />
                              <span>
                                Para completar el paso 1, debes llenar toda la
                                información del formulario.
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaCheckCircle
                                className="text-terrasacha-success"
                                size={14}
                              />
                              <span>¡Paso 1 completado!</span>
                            </div>
                          )
                        ) : (
                          <span>{step.description}</span>
                        )}
                      </Tooltip>

                      <p
                        className={`mt-3 text-sm font-typographica font-semibold transition-all duration-500 ${
                          step.id === currentStep
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 font-bold"
                            : accomplished
                            ? "text-terrasacha-success"
                            : "text-terrasacha-secondary1"
                        } hover:text-terrasacha-primary hover:scale-105 transform`}
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

      {helpStep && (
        <StepHelpModal
          isOpen={!!helpStep}
          onClose={closeHelp}
          stepTitle={helpStep.title}
          stepDescription={helpStep.helpText}
        />
      )}
    </>
  );
}
