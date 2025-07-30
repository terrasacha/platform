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
  chatTarget
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chatModalIsOpen, setChatModalIsOpen] = useState(false);
  const [propertyFeatureID, setPropertyFeatureID] = useState(null);
  const [propertyVerificationID, setPropertyVerificationID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpStep, setHelpStep] = useState(null); // null o el step actual
  const openHelp = (step) => setHelpStep(step);
  const closeHelp = () => setHelpStep(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!openChatOnLoad || !chatTarget) return;
  
    if (chatTarget === "legal" ) {
      setModalIsOpen(true); // Abrir ValidationModal
    }
  
    if (chatTarget === "validator" ) {
      handleChatFeature(); // Abrir PropertyChat
    }
  }, [openChatOnLoad, currentStep, chatTarget]);

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
      setModalIsOpen(true);
    }
    if (stepId === 4) {
      handleChatFeature();
    }
  };
  
  const closeModal = () => {
    console.log("🔴 Cerrando el modal...");
    setModalIsOpen(false);
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
  
        setChatModalIsOpen(true);
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
  
      setChatModalIsOpen(true);
      console.log("✅ PropertyFeature y Verification creados con éxito.");
    } catch (error) {
      console.error("❌ Error al crear PropertyFeature y Verification:", error);
    } finally {
      setIsLoading(false);
    }
  };
   
  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      <div className="w-full max-w-4xl">
        <ProgressBar
          percent={((currentStep - 1) / (steps.length - 1)) * 100}
          filledBackground="linear-gradient(to right, #849b50, #6e6c35)"
          height={8}
          transitionDuration={800}
          className="rounded-full"
        >
          {steps.map((step, index) => (
            <Step key={step.id}>
              {({ accomplished }) => {
                let stepClass = "bg-terrasacha-light text-terrasacha-secondary1 border-terrasacha-light opacity-50";

                // 🔥 Si es el paso actual, se pone con el color primario de Terrasacha
                if (step.id === currentStep && step.id !== steps.length) {
                  stepClass = "bg-terrasacha-primary text-white border-terrasacha-primary animate-pulse-terrasacha shadow-terrasacha-xl";
                }
                else if (accomplished) {
                  stepClass = "bg-terrasacha-success text-white border-terrasacha-success shadow-terrasacha-lg hover:shadow-terrasacha-xl";
                }

                // 🔥 Animación especial para el paso 2 (resplandor y pulsación)
                const isStep2Active = step.id === 2 && currentStep === 2;
                const glowEffect = isStep2Active
                  ? "animate-pulse ring-4 ring-terrasacha-earth"
                  : "";

                return (
                  <div className="flex flex-col items-center w-28 text-center relative">
                    {/* 📌 Flecha animada SOLO para el paso 2 */}
                    {isStep2Active && (
                      <div className="absolute -top-8 text-terrasacha-primary text-lg font-typographica font-bold animate-bounce">
                        ⬇️
                        <p className="text-xs font-typographica font-semibold">clic</p>
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
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 cursor-pointer transition-opacity duration-300 hover:opacity-100"
                          title="Ver explicación del paso"
                          aria-label="Ayuda del paso"
                        >
                          <FaQuestionCircle size={16} className="text-terrasacha-primary opacity-90" />
                        </span>

                        <Tooltip id={`help-tooltip-${step.id}`} place="top" effect="solid" />
                      </div>
                    </div>

                    <div className="w-1 h-8 bg-terrasacha-light mx-auto mt-2"></div>

                    <Tooltip
                      id={`tooltip-${step.id}`}
                      effect="solid"
                      place="bottom"
                      className="text-xs p-4 bg-terrasacha-secondary1 text-white rounded-xl shadow-terrasacha-xl flex items-center gap-2 animate-fade-in font-typographica max-w-xs"
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
                      className={`mt-3 text-sm font-typographica font-semibold transition-colors duration-500 ${
                        step.id === currentStep
                          ? "text-terrasacha-primary font-bold"
                          : accomplished
                          ? "text-terrasacha-success"
                          : "text-terrasacha-secondary1"
                      } hover:text-terrasacha-primary`}
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
      
      <ValidationModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onValidationComplete={handleValidationComplete}
        checkDocuments={true}
      />

      {/* Custom Chat Modal */}
      {chatModalIsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={() => setChatModalIsOpen(false)}
            ></div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-terrasacha border-0 rounded-t-2xl p-6 flex items-center justify-between">
                <h3 className="text-xl font-typographica font-bold text-white">
                  Proceso del Predio
                </h3>
                <button
                  onClick={() => setChatModalIsOpen(false)}
                  className="text-white hover:text-terrasacha-light transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-gradient-terrasacha-subtle">
                <ConstructorWorkflow propertyId={propertyId} />
              </div>
            </div>
          </div>
        </div>
      )}

      {helpStep && (
        <StepHelpModal
          isOpen={!!helpStep}
          onClose={closeHelp}
          stepTitle={helpStep.title}
          stepDescription={helpStep.helpText}
        />
      )}
    </div>
  );
}
