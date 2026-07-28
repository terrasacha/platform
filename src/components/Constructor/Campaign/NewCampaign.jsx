import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Card from "components/common/Card";
import { createCampaign, updateCampaign } from "graphql/customMutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { Auth } from "aws-amplify";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { createProduct, createUserProduct } from "graphql/mutations";
import { FaRocket, FaLightbulb, FaCalendarAlt, FaImage, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import {
  getNewCampaignFormProgress,
  newCampaignFormSteps,
} from "utilities/newCampaignFormProgress";

const initialForm = {
  name: "",
  userID: "",
  description: "",
  initialDate: "",
  endDate: "",
  available: true,
  images: JSON.stringify([]),
};

export default function NewCampaign() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const userID = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((data) => {
      userID.current = data.attributes.sub;
    }).catch((error) => {
      navigate('/')
    });
  }, []);

  const {
    progress,
    completedSteps,
    nextStep,
    nextStepHint,
    feedbackMessage,
    isReadyToSubmit,
  } = getNewCampaignFormProgress(formData, images);

  const completedStepIds = new Set(completedSteps.map((step) => step.id));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la campaña es obligatorio.";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria.";
    } else if (formData.description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres.";
    }

    if (!formData.initialDate) {
      newErrors.initialDate = "La fecha inicial es obligatoria.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de finalización es obligatoria.";
    } else if (formData.initialDate && formData.endDate < formData.initialDate) {
      newErrors.endDate =
        "La fecha de finalización no puede ser anterior a la fecha inicial.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log(`🔄 Campo cambiado: ${name}`, { value, type, checked, files });
  
    // Manejo especial para el campo 'images'
    if (name === "images") {
      console.log("🖼️ Procesando cambio en campo de imágenes...");
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const selectedFiles = Array.from(files);
      console.log("📁 Archivos seleccionados:", selectedFiles);
  
      // Filtrar solo imágenes permitidas
      const validImages = selectedFiles.filter(file => allowedTypes.includes(file.type));
      const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
      console.log("✅ Imágenes válidas:", validImages);
      console.log("❌ Archivos inválidos:", invalidFiles);
  
      // Si hay archivos no válidos, mostrar error
      if (invalidFiles.length > 0) {
        console.log("⚠️ Archivos inválidos detectados, estableciendo error");
        setErrors((prevErrors) => ({
          ...prevErrors,
          images: "Solo se permiten imágenes en formato JPG, PNG o GIF.",
        }));
      } else {
        console.log("✅ Todos los archivos son válidos, limpiando errores");
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.images; // Eliminar error si los archivos son válidos
          return updatedErrors;
        });
      }
  
      // Guardar solo imágenes válidas
      setImages(validImages);
      console.log("💾 Imágenes guardadas en estado:", validImages);
    } else {
      // Actualizar el estado del formulario para otros campos
      console.log(`📝 Actualizando campo ${name} con valor:`, value);
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  
    // Validación en tiempo real: Eliminar errores del campo si se corrige
    if (showErrors) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
  
        if (name === "name" && value.trim()) {
          if (value.length < 3) {
            updatedErrors.name = "El nombre debe tener al menos 3 caracteres.";
          } else {
            delete updatedErrors.name;
          }
        }
  
        if (name === "description" && value.trim()) {
          if (value.length < 10) {
            updatedErrors.description =
              "La descripción debe tener al menos 10 caracteres.";
          } else {
            delete updatedErrors.description;
          }
        }
  
        if (name === "initialDate" && value) {
          delete updatedErrors.initialDate;
        }
  
        if (name === "endDate" && value) {
          if (formData.initialDate && value < formData.initialDate) {
            updatedErrors.endDate =
              "La fecha de finalización no puede ser anterior a la fecha inicial.";
          } else {
            delete updatedErrors.endDate;
          }
        }
  
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Iniciando creación de campaña...");
    console.log("📝 Datos del formulario:", formData);
    console.log("🖼️ Imágenes seleccionadas:", images);
    
    setShowErrors(true); // Mostrar errores solo al intentar enviar
    if (!validateForm()) {
      console.log("❌ Validación del formulario falló");
      return;
    }
    
    console.log("✅ Validación del formulario exitosa");
    setLoading(true);
    formData.userID = userID.current;
    console.log("👤 UserID establecido:", userID.current);
    
    const duplicates = await checkDuplicateCampaignName(formData.name);
    if (duplicates.length > 0) {
      console.log("⚠️ Nombre de campaña duplicado encontrado");
      toast.error("El nombre de la campaña ya existe. Elige otro.");
      setLoading(false);
      return;
    }
    
    console.log("✅ Nombre de campaña único, procediendo...");

    const timestampData = {
      ...formData,
      initialDate: formData.initialDate
        ? Math.floor(new Date(formData.initialDate).getTime() / 1000)
        : "",
      endDate: formData.endDate
        ? Math.floor(new Date(formData.endDate).getTime() / 1000)
        : "",
    };
    
    console.log("⏰ Datos con timestamps:", timestampData);

    try {
      console.log("🔄 Creando campaña en la base de datos...");
      const result = await API.graphql(
        graphqlOperation(createCampaign, { input: timestampData })
      );
      const campaignId = result.data.createCampaign.id;
      const campaignName = formData.name;
      console.log("✅ Campaña creada en BD:", { id: campaignId, name: campaignName });

      console.log("🔄 Creando producto asociado...");
      const result2 = await API.graphql(
        graphqlOperation(createProduct, {
          input: {
            name: `Proyecto - ${campaignName}`,
            description: "",
            isActive: false,
            categoryID: "MIXTO",
            isActiveOnPlatform: true,
            campaignID: campaignId
          },
        })
      );
      const productId = result2.data.createProduct.id;
      console.log("✅ Producto creado:", { id: productId, campaignID: campaignId });

      let imageUrls = [];
      if (images.length > 0) {
        console.log("🚀 Iniciando subida de imágenes...");
        console.log("📁 Número de imágenes a subir:", images.length);
        console.log("🖼️ Imágenes:", images);
        console.log("🔧 Variable de entorno REACT_APP_URL_BUCKET:", process.env.REACT_APP_URL_BUCKET);
        console.log("🔧 Todas las variables de entorno:", process.env);
        
        for (let image of images) {
          console.log("📤 Subiendo imagen:", image.name);
          console.log("📋 Tipo de imagen:", image.type);
          console.log("📏 Tamaño de imagen:", image.size, "bytes");
          
          const fileName = `campaign/${campaignId}-campaign/${image.name}`;
          console.log("📁 Nombre del archivo en S3:", fileName);
          
          try {
            await Storage.put(fileName, image, {
              contentType: image.type,
            });
            console.log("✅ Imagen subida exitosamente a S3:", fileName);

            const imageUrlObj = `${
              process.env.REACT_APP_URL_BUCKET
            }/public/campaign/${campaignId}-campaign/${encodeURIComponent(
              image.name
            )}`;
            
            // Validar que la URL sea válida antes de guardarla
            if (process.env.REACT_APP_URL_BUCKET && process.env.REACT_APP_URL_BUCKET !== 'undefined') {
              console.log("🔗 URL de la imagen generada:", imageUrlObj);
              imageUrls.push(imageUrlObj);
            } else {
              console.error("❌ Variable de entorno REACT_APP_URL_BUCKET no está definida o es inválida");
              console.error("🔧 Valor actual:", process.env.REACT_APP_URL_BUCKET);
              throw new Error("Variable de entorno REACT_APP_URL_BUCKET no está configurada correctamente");
            }
          } catch (uploadError) {
            console.error("❌ Error al subir imagen:", image.name, uploadError);
            throw uploadError;
          }
        }
        
        console.log("📊 Total de URLs de imágenes generadas:", imageUrls.length);
        console.log("🔗 URLs finales:", imageUrls);
      } else {
        console.log("ℹ️ No hay imágenes para subir");
      }

      if (imageUrls.length > 0) {
        console.log("🔄 Actualizando campaña con URLs de imágenes...");
        console.log("📝 Datos a actualizar:", {
          id: campaignId,
          images: JSON.stringify(imageUrls)
        });
        
        await API.graphql(
          graphqlOperation(updateCampaign, {
            input: {
              id: campaignId,
              images: JSON.stringify(imageUrls),
            },
          })
        );
        console.log("✅ Campaña actualizada con imágenes exitosamente");
      }
      
      await API.graphql(graphqlOperation(createUserProduct, { input:{
        userID: userID.current,
        productID: productId
      }}))
      
      console.log("🎉 ¡Campaña creada exitosamente!");
      console.log("🆔 ID de la campaña:", campaignId);
      console.log("🆔 ID del producto:", productId);
      console.log("🖼️ URLs de imágenes guardadas:", imageUrls);
      
      toast.success("Campaña creada con éxito", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(`/campaign/${campaignId}`);
    } catch (error) {
      console.error("❌ Error al crear la campaña o subir imágenes:", error);
      console.error("🔍 Detalles del error:", {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      toast.error("Hubo un error al crear la campaña");
    } finally {
      console.log("🏁 Finalizando proceso de creación de campaña");
      setLoading(false);
    }
  };

  const checkDuplicateCampaignName = async (name) => {
    const query = `
      query CheckDuplicateCampaign($filter: ModelCampaignFilterInput) {
        listCampaigns(filter: $filter) {
          items {
            id
            name
          }
        }
      }
    `;
  
    try {
      const result = await API.graphql(
        graphqlOperation(query, {
          filter: {
            name: { eq: name },
          },
        })
      );
      return result.data.listCampaigns.items;
    } catch (error) {
      console.error("Error verificando duplicados:", error);
      return [];
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-terrasacha-earth/5 via-white to-terrasacha-light/5 pt-16 relative overflow-hidden">
      {/* Elementos decorativos de fondo - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:-top-40 md:-right-40 md:w-80 md:h-80 bg-gradient-to-br from-terrasacha-primary/5 to-terrasacha-light/10 rounded-full blur-3xl animate-pulse-terrasacha"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 md:-bottom-40 md:-left-40 md:w-96 md:h-96 bg-gradient-to-tr from-terrasacha-earth/10 to-terrasacha-secondary2/5 rounded-full blur-3xl animate-pulse-terrasacha" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-r from-terrasacha-light/20 to-transparent rounded-full blur-2xl animate-pulse-terrasacha" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="flex justify-center px-4 sm:px-6 md:px-8 lg:px-0 relative z-10">
        <div className="w-full max-w-5xl mt-4 sm:mt-6 md:mt-8 mb-8">
          
          {/* Header principal con animación - Responsive */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-terrasacha rounded-2xl sm:rounded-3xl shadow-terrasacha-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
              <FaRocket className="text-white text-2xl sm:text-3xl md:text-3xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-champagne font-bold bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary2 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
              Nueva Campaña
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-typographica text-terrasacha-secondary1 max-w-3xl mx-auto leading-relaxed px-4">
              Crea una nueva campaña para conectar con inversores y hacer realidad tu proyecto sostenible
            </p>
          </div>

          {/* Barra de progreso y pasos — Responsive */}
          <div className="mb-6 sm:mb-8 animate-slide-up px-2">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-typographica font-medium text-terrasacha-secondary1">
                Progreso del formulario
              </span>
              <span
                className="text-xs sm:text-sm font-typographica font-semibold text-terrasacha-primary"
                aria-live="polite"
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="w-full bg-terrasacha-light/20 rounded-full h-2 sm:h-3 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso del formulario de nueva campaña"
            >
              <div
                className="h-full bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {newCampaignFormSteps.map((step) => {
                const isComplete = completedStepIds.has(step.id);
                const isCurrent = nextStep?.id === step.id;

                return (
                  <div
                    key={step.id}
                    className={`rounded-xl border px-2 py-2 text-center transition-all duration-300 sm:px-3 sm:py-2.5 ${
                      isComplete
                        ? "border-terrasacha-secondary2/40 bg-terrasacha-secondary2/10"
                        : isCurrent
                        ? "border-terrasacha-primary bg-terrasacha-primary/5 ring-1 ring-terrasacha-primary/30"
                        : "border-terrasacha-light/30 bg-white/60 opacity-70"
                    }`}
                  >
                    <p className="mb-0 text-[10px] font-typographica font-semibold uppercase tracking-wide text-terrasacha-secondary1 sm:text-xs">
                      {step.percent}%
                    </p>
                    <p className="mb-0 mt-0.5 text-xs font-typographica font-medium text-terrasacha-secondary1 sm:text-sm">
                      {step.shortLabel}
                      {step.required ? (
                        <span className="text-red-500" aria-hidden="true">
                          {" "}
                          *
                        </span>
                      ) : (
                        <span className="block text-[10px] font-normal text-terrasacha-secondary1/70 sm:text-xs">
                          (opcional)
                        </span>
                      )}
                    </p>
                    {isComplete && (
                      <FaCheckCircle
                        className="mx-auto mt-1 text-terrasacha-secondary2"
                        aria-hidden="true"
                        size={12}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="mt-3 rounded-xl border border-terrasacha-light/30 bg-white/70 px-3 py-2.5 sm:px-4 sm:py-3"
              role="status"
              aria-live="polite"
            >
              {feedbackMessage && (
                <p className="mb-0 text-xs font-typographica text-terrasacha-secondary1 sm:text-sm">
                  <FaCheckCircle
                    className="mr-1.5 inline text-terrasacha-secondary2"
                    aria-hidden="true"
                  />
                  {feedbackMessage}
                </p>
              )}
              {nextStep ? (
                <p
                  className={`mb-0 text-xs font-typographica text-terrasacha-secondary1 sm:text-sm ${
                    feedbackMessage ? "mt-1.5" : ""
                  }`}
                >
                  Siguiente paso ({nextStep.percent}%): {nextStep.label}.{" "}
                  {nextStepHint}
                </p>
              ) : (
                !feedbackMessage && (
                  <p className="mb-0 text-xs font-typographica text-terrasacha-secondary1 sm:text-sm">
                    {nextStepHint}
                  </p>
                )
              )}
              {isReadyToSubmit && progress < 100 && (
                <p className="mb-0 mt-1.5 text-xs font-typographica text-terrasacha-earth">
                  Los campos obligatorios están completos. Puedes crear la campaña o
                  agregar imágenes para alcanzar el 100%.
                </p>
              )}
            </div>
          </div>

          {/* Formulario principal con diseño moderno - Responsive */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-terrasacha-2xl border border-white/20 p-4 sm:p-6 md:p-8 lg:p-12 animate-scale-in">
            <Form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              
              {/* Campo Nombre con icono - Responsive */}
              <div className="group">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-terrasacha-primary/10 to-terrasacha-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaLightbulb className="text-terrasacha-primary text-sm sm:text-lg" />
                  </div>
                  <label 
                    htmlFor="name" 
                    className="font-typographica font-semibold text-terrasacha-secondary1 text-base sm:text-lg"
                  >
                    Nombre de la Campaña
                    <span className="text-red-500" aria-hidden="true"> *</span>
                    <span className="sr-only"> (obligatorio, aporta 25% al progreso)</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  placeholder="Ingresa el nombre de tu campaña"
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl font-typographica text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terrasacha-primary/20 focus:border-terrasacha-primary ${
                    showErrors && errors.name 
                      ? 'border-red-400 bg-red-50/50' 
                      : activeField === 'name'
                      ? 'border-terrasacha-primary bg-white shadow-terrasacha-lg'
                      : 'border-terrasacha-light/30 hover:border-terrasacha-light/50 hover:shadow-terrasacha'
                  }`}
                />
                {showErrors && errors.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs sm:text-sm font-typographica">
                    <FaExclamationTriangle className="text-red-400 text-xs sm:text-sm" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Campo Descripción con contador de caracteres - Responsive */}
              <div className="group">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-terrasacha-secondary2/10 to-terrasacha-secondary2/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaLightbulb className="text-terrasacha-secondary2 text-sm sm:text-lg" />
                  </div>
                  <label 
                    htmlFor="description" 
                    className="font-typographica font-semibold text-terrasacha-secondary1 text-base sm:text-lg"
                  >
                    Descripción
                    <span className="text-red-500" aria-hidden="true"> *</span>
                    <span className="sr-only"> (obligatorio, aporta hasta 50% al progreso)</span>
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onFocus={() => setActiveField('description')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Describe tu proyecto, objetivos y visión de sostenibilidad..."
                    rows={4}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl font-typographica text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terrasacha-secondary2/20 focus:border-terrasacha-secondary2 resize-none ${
                      showErrors && errors.description 
                        ? 'border-red-400 bg-red-50/50' 
                        : activeField === 'description'
                        ? 'border-terrasacha-secondary2 bg-white shadow-terrasacha-lg'
                        : 'border-terrasacha-light/30 hover:border-terrasacha-light/50 hover:shadow-terrasacha'
                    }`}
                  />
                  <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs font-typographica text-terrasacha-secondary1/60">
                    {formData.description.length}/500
                  </div>
                </div>
                {showErrors && errors.description && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs sm:text-sm font-typographica">
                    <FaExclamationTriangle className="text-red-400 text-xs sm:text-sm" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Fechas en grid moderno - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {/* Campo Fecha Inicial */}
                <div className="group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-terrasacha-light/10 to-terrasacha-light/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaCalendarAlt className="text-terrasacha-light text-sm sm:text-lg" />
                    </div>
                    <label 
                      htmlFor="initialDate" 
                      className="font-typographica font-semibold text-terrasacha-secondary1 text-base sm:text-lg"
                    >
                      Fecha de Inicio
                      <span className="text-red-500" aria-hidden="true"> *</span>
                    </label>
                  </div>
                  <input
                    type="date"
                    id="initialDate"
                    name="initialDate"
                    value={formData.initialDate}
                    onChange={handleChange}
                    onFocus={() => setActiveField('initialDate')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl font-typographica text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terrasacha-light/20 focus:border-terrasacha-light ${
                      showErrors && errors.initialDate 
                        ? 'border-red-400 bg-red-50/50' 
                        : activeField === 'initialDate'
                        ? 'border-terrasacha-light bg-white shadow-terrasacha-lg'
                        : 'border-terrasacha-light/30 hover:border-terrasacha-light/50 hover:shadow-terrasacha'
                    }`}
                  />
                  {showErrors && errors.initialDate && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs sm:text-sm font-typographica">
                      <FaExclamationTriangle className="text-red-400 text-xs sm:text-sm" />
                      {errors.initialDate}
                    </div>
                  )}
                </div>

                {/* Campo Fecha Final */}
                <div className="group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-terrasacha-earth/10 to-terrasacha-earth/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaCalendarAlt className="text-terrasacha-earth text-sm sm:text-lg" />
                    </div>
                    <label 
                      htmlFor="endDate" 
                      className="font-typographica font-semibold text-terrasacha-secondary1 text-base sm:text-lg"
                    >
                      Fecha de Finalización
                      <span className="text-red-500" aria-hidden="true"> *</span>
                      <span className="sr-only"> (obligatorias, aportan hasta 75% al progreso)</span>
                    </label>
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    onFocus={() => setActiveField('endDate')}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl font-typographica text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terrasacha-earth/20 focus:border-terrasacha-earth ${
                      showErrors && errors.endDate 
                        ? 'border-red-400 bg-red-50/50' 
                        : activeField === 'endDate'
                        ? 'border-terrasacha-earth bg-white shadow-terrasacha-lg'
                        : 'border-terrasacha-light/30 hover:border-terrasacha-light/50 hover:shadow-terrasacha'
                    }`}
                  />
                  {showErrors && errors.endDate && (
                    <div className="flex items-center gap-2 mt-2 text-red-500 text-xs sm:text-sm font-typographica">
                      <FaExclamationTriangle className="text-red-400 text-xs sm:text-sm" />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Campo Imágenes con preview - Responsive */}
              <div className="group">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-terrasacha-secondary1/10 to-terrasacha-secondary1/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaImage className="text-terrasacha-secondary1 text-sm sm:text-lg" />
                  </div>
                  <label 
                    htmlFor="images" 
                    className="font-typographica font-semibold text-terrasacha-secondary1 text-base sm:text-lg"
                  >
                    Imágenes de la Campaña
                    <span className="ml-1 text-sm font-normal text-terrasacha-secondary1/70">
                      (opcional — 100% del progreso)
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/jpeg, image/png, image/gif"
                    onChange={handleChange}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl font-typographica text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terrasacha-secondary1/20 focus:border-terrasacha-secondary1 file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-lg sm:file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-typographica file:font-semibold file:bg-gradient-to-r file:from-terrasacha-light file:to-terrasacha-secondary2 file:text-white hover:file:from-terrasacha-light/90 hover:file:to-terrasacha-secondary2/90 file:transition-all file:duration-300 ${
                      errors.images 
                        ? 'border-red-400 bg-red-50/50' 
                        : 'border-terrasacha-light/30 hover:border-terrasacha-light/50 hover:shadow-terrasacha'
                    }`}
                  />
                </div>
                {errors.images && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-xs sm:text-sm font-typographica">
                    <FaExclamationTriangle className="text-red-400 text-xs sm:text-sm" />
                    {errors.images}
                  </div>
                )}
                <p className="text-xs sm:text-sm font-typographica text-terrasacha-secondary1/70 mt-2 sm:mt-3 px-1">
                  Formatos aceptados: JPG, PNG, GIF. Selecciona imágenes que representen tu proyecto.
                </p>
                
                {/* Preview de imágenes seleccionadas - Responsive */}
                {images.length > 0 && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-terrasacha-light/10 rounded-xl sm:rounded-2xl border border-terrasacha-light/20">
                    <p className="text-xs sm:text-sm font-typographica font-medium text-terrasacha-secondary1 mb-2 sm:mb-3">
                      Imágenes seleccionadas ({images.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl border border-terrasacha-light/30">
                          <FaCheckCircle className="text-terrasacha-secondary2 text-xs sm:text-sm" />
                          <span className="text-xs font-typographica text-terrasacha-secondary1 truncate max-w-24 sm:max-w-32">
                            {image.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de envío con efectos avanzados - Responsive */}
              <div className="pt-6 sm:pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-gradient-to-r from-terrasacha-primary via-terrasacha-secondary2 to-terrasacha-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-champagne font-bold text-lg sm:text-xl py-4 sm:py-6 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-terrasacha-2xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center gap-3 sm:gap-4 relative z-10">
                      <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-4 border-white border-t-transparent rounded-full"></div>
                      <span className="text-base sm:text-lg">Creando Campaña...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                      <FaRocket className="text-lg sm:text-xl group-hover:animate-bounce" />
                      <span>Crear Campaña</span>
                    </div>
                  )}
                </button>
              </div>
            </Form>
          </div>

          {/* Información adicional con diseño moderno - Responsive */}
          <div className="mt-8 sm:mt-10 md:mt-12 text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 shadow-terrasacha">
              <FaCheckCircle className="text-terrasacha-secondary2 text-base sm:text-lg" />
              <p className="text-xs sm:text-sm font-typographica text-terrasacha-secondary1 mb-0">
                Al crear una campaña, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}