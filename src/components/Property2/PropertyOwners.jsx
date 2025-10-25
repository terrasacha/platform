import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { useS3Client } from "context/s3ClientContext";
import Swal from "sweetalert2";
import {
  FaUser,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaIdCard,
  FaCamera,
} from "react-icons/fa";

// --- Mapeo de roles ---
const roleMapping = {
  constructor: "Constructor",
  legal: "Revisor Legal",
  validator: "Validador",
  admon: "Administrador",
  analyst: "Analista",
};

export default function PropertyOwners({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
  currentStep,
}) {
  const { user } = useAuth();
  const { propertyData } = usePropertyData();
  const { s3Client, bucketName } = useS3Client();

  // Estados principales
  const [isThirdParty, setIsThirdParty] = useState(null); // null = no seleccionado, true = tercero, false = propio
  const [owners, setOwners] = useState([]);
  const [loggedUserData, setLoggedUserData] = useState({
    name: "",
    email: "",
    phone: "",
    idFront: null,
    idBack: null,
    selfie: null,
  });

  // Estados para formularios
  const [currentOwner, setCurrentOwner] = useState({
    name: "",
    email: "",
    phone: "",
    idFront: null,
    idBack: null,
    selfie: null,
  });

  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'postulante' o 'propietario'
  const [modalTitle, setModalTitle] = useState("");
  const [postulanteData, setPostulanteData] = useState(null); // Datos del postulante guardados
  const [propietariosData, setPropietariosData] = useState([]); // Array de propietarios guardados
  const [showAddPropietario, setShowAddPropietario] = useState(false); // Mostrar card para agregar más propietarios

  useEffect(() => {
    if (user) {
      setLoggedUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        idFront: null,
        idBack: null,
        selfie: null,
      });
    }
  }, [user]);

  const handleFileUpload = (file, type, ownerIndex = null) => {
    if (!file) return null;

    // Actualizar currentOwner con el archivo seleccionado
    setCurrentOwner((prev) => ({
      ...prev,
      [type]: file,
    }));

    setHasUnsavedChanges(true);
    toast.success("Archivo seleccionado correctamente");
    return file;
  };

  const uploadFileToS3 = async (file, type) => {
    if (!file) return null;

    try {
      const fileKey = `public/property/${
        propertyData?.propertyInfo?.id
      }/owners/${type}/${Date.now()}_${file.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      await s3Client.send(
        new (
          await import("@aws-sdk/client-s3")
        ).PutObjectCommand(uploadParams)
      );

      const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleInputChange = (field, value, ownerIndex = null) => {
    if (ownerIndex !== null) {
      // Actualizar propietario específico
      const updatedOwners = [...owners];
      updatedOwners[ownerIndex] = {
        ...updatedOwners[ownerIndex],
        [field]: value,
      };
      setOwners(updatedOwners);
    } else {
      // Actualizar usuario logueado
      setLoggedUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    setHasUnsavedChanges(true);
    handleFieldChange(`owner_${field}`, value);
  };

  const openModal = (type) => {
    setModalType(type);
    if (type === "postulante") {
      setModalTitle("Información del Postulante");
    } else {
      setModalTitle("Información del Propietario");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setModalTitle("");
    setCurrentOwner({
      name: "",
      email: "",
      phone: "",
      idFront: null,
      idBack: null,
      selfie: null,
    });
    setEditingIndex(-1);
  };

  const addOwner = async () => {
    // Validar campos requeridos
    if (!currentOwner.name || !currentOwner.email || !currentOwner.phone) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor completa todos los campos obligatorios (Nombre, Email, Teléfono)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    const hasValidFiles = currentOwner.idFront instanceof File && 
                         currentOwner.idBack instanceof File && 
                         currentOwner.selfie instanceof File;
    
    if (!hasValidFiles) {
      Swal.fire({
        title: "Documentos Requeridos",
        text: "Por favor sube todos los documentos obligatorios (Cédula frente, Cédula reverso, Selfie)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    try {
      // Mostrar loading
      Swal.fire({
        title: "Subiendo archivos...",
        text: "Por favor espera mientras se suben los documentos",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Subir archivos al S3
      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        uploadFileToS3(currentOwner.idFront, "idFront"),
        uploadFileToS3(currentOwner.idBack, "idBack"),
        uploadFileToS3(currentOwner.selfie, "selfie")
      ]);

      // Crear objeto con URLs de los archivos subidos
      const ownerData = {
        id: Date.now(),
        name: currentOwner.name,
        email: currentOwner.email,
        phone: currentOwner.phone,
        idFront: idFrontUrl,
        idBack: idBackUrl,
        selfie: selfieUrl,
      };

      if (modalType === "postulante") {
        setPostulanteData(ownerData);
        Swal.fire({
          title: "¡Información Guardada!",
          text: "La información del postulante ha sido guardada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Agregar propietario al array
        setPropietariosData(prev => [...prev, ownerData]);
        setShowAddPropietario(true); // Mostrar card para agregar más
        Swal.fire({
          title: "¡Propietario Agregado!",
          text: "La información del propietario ha sido guardada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      
      setCurrentOwner({
        name: "",
        email: "",
        phone: "",
        idFront: null,
        idBack: null,
        selfie: null,
      });
      setIsAddingOwner(false);
      setHasUnsavedChanges(true);
      closeModal();
    } catch (error) {
      console.error("Error uploading files:", error);
      Swal.fire({
        title: "Error al Subir Archivos",
        text: "Hubo un problema al subir los documentos. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    }
  };

  const editOwner = (index) => {
    setCurrentOwner({ ...owners[index] });
    setEditingIndex(index);
    setIsAddingOwner(true);
  };

  const updateOwner = async () => {
    // Validar campos requeridos
    if (!currentOwner.name || !currentOwner.email || !currentOwner.phone) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor completa todos los campos obligatorios (Nombre, Email, Teléfono)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    // Validar documentos requeridos
    const hasValidFiles = currentOwner.idFront instanceof File && 
                         currentOwner.idBack instanceof File && 
                         currentOwner.selfie instanceof File;
    
    if (!hasValidFiles) {
      Swal.fire({
        title: "Documentos Requeridos",
        text: "Por favor sube todos los documentos obligatorios (Cédula frente, Cédula reverso, Selfie)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    if (editingIndex >= 0) {
      try {
        // Mostrar loading
        Swal.fire({
          title: "Subiendo archivos...",
          text: "Por favor espera mientras se suben los documentos",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Subir archivos al S3
        const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
          uploadFileToS3(currentOwner.idFront, "idFront"),
          uploadFileToS3(currentOwner.idBack, "idBack"),
          uploadFileToS3(currentOwner.selfie, "selfie")
        ]);

        // Crear objeto con URLs de los archivos subidos
        const updatedOwnerData = {
          ...currentOwner,
          idFront: idFrontUrl,
          idBack: idBackUrl,
          selfie: selfieUrl,
        };

        const updatedOwners = [...owners];
        updatedOwners[editingIndex] = updatedOwnerData;
        setOwners(updatedOwners);
        setEditingIndex(-1);
        setIsAddingOwner(false);
        setCurrentOwner({
          name: "",
          email: "",
          phone: "",
          idFront: null,
          idBack: null,
          selfie: null,
        });
        setHasUnsavedChanges(true);
        
        Swal.fire({
          title: "¡Propietario Actualizado!",
          text: "La información del propietario ha sido actualizada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        closeModal();
      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire({
          title: "Error al Subir Archivos",
          text: "Hubo un problema al subir los documentos. Por favor intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8B4513",
        });
      }
    }
  };

  const removeOwner = (index) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
    setHasUnsavedChanges(true);
    toast.success("Propietario eliminado");
  };

  const removePropietario = (id) => {
    setPropietariosData(prev => prev.filter(prop => prop.id !== id));
    setHasUnsavedChanges(true);
    toast.success("Propietario eliminado");
  };

  const hasDataEntered = () => {
    return postulanteData !== null || propietariosData.length > 0;
  };

  const cancelEdit = () => {
    setCurrentOwner({
      name: "",
      email: "",
      phone: "",
      idFront: null,
      idBack: null,
      selfie: null,
    });
    setIsAddingOwner(false);
    setEditingIndex(-1);
  };

  const validateOwnerData = (ownerData, isLoggedUser = false) => {
    const errors = [];

    // Validar campos obligatorios
    if (!ownerData.name || ownerData.name.trim() === "") {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} nombre es obligatorio`
      );
    }

    if (!ownerData.email || ownerData.email.trim() === "") {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } correo electrónico es obligatorio`
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email)) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } correo electrónico no tiene un formato válido`
      );
    }

    if (!ownerData.phone || ownerData.phone.trim() === "") {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} teléfono es obligatorio`
      );
    }

    // Validar documentos obligatorios
    if (!ownerData.idFront) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } cédula (frente) es obligatoria`
      );
    }

    if (!ownerData.idBack) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } cédula (reverso) es obligatoria`
      );
    }

    if (!ownerData.selfie) {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} selfie es obligatoria`
      );
    }

    return errors;
  };


  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Pregunta inicial - Siempre visible */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <h2 className="text-lg sm:text-xl font-bold text-terrasacha-primary mb-4 font-typographica">
          ¿Cuál es tu relación con esta propiedad?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => !hasDataEntered() && setIsThirdParty(false)}
            disabled={hasDataEntered()}
            className={`p-4 sm:p-6 border-2 rounded-xl transition-colors text-left ${
              isThirdParty === false
                ? "border-terrasacha-primary bg-terrasacha-primary/5"
                : hasDataEntered()
                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                : "border-terrasacha-light hover:border-terrasacha-primary"
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-3">👤</div>
            <h3 className="text-base sm:text-lg font-semibold text-terrasacha-primary mb-2 font-typographica">
              Soy propietario
            </h3>
            <p className="text-sm sm:text-base text-terrasacha-secondary1 font-typographica">
              La propiedad está a mi nombre (puede tener otros propietarios)
            </p>
            {isThirdParty === false && (
              <div className="mt-3 text-sm text-terrasacha-primary font-semibold font-typographica">
                ✓ Seleccionado
              </div>
            )}
            {hasDataEntered() && isThirdParty !== false && (
              <div className="mt-3 text-sm text-gray-500 font-semibold font-typographica">
                🔒 Bloqueado
              </div>
            )}
          </button>
          <button
            onClick={() => !hasDataEntered() && setIsThirdParty(true)}
            disabled={hasDataEntered()}
            className={`p-4 sm:p-6 border-2 rounded-xl transition-colors text-left ${
              isThirdParty === true
                ? "border-terrasacha-primary bg-terrasacha-primary/5"
                : hasDataEntered()
                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                : "border-terrasacha-light hover:border-terrasacha-primary"
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-3">👥</div>
            <h3 className="text-base sm:text-lg font-semibold text-terrasacha-primary mb-2 font-typographica">
              Es de un tercero
            </h3>
            <p className="text-sm sm:text-base text-terrasacha-secondary1 font-typographica">
              La propiedad está a nombre de otra(s) persona(s)
            </p>
            {isThirdParty === true && (
              <div className="mt-3 text-sm text-terrasacha-primary font-semibold font-typographica">
                ✓ Seleccionado
              </div>
            )}
            {hasDataEntered() && isThirdParty !== true && (
              <div className="mt-3 text-sm text-gray-500 font-semibold font-typographica">
                🔒 Bloqueado
              </div>
            )}
          </button>
        </div>
        {hasDataEntered() && (
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 font-typographica mb-0">
              ℹ️ Una vez que has ingresado información, no puedes cambiar tu relación con la propiedad.
            </p>
          </div>
        )}
      </div>

      {/* Formulario de propietarios */}
      {isThirdParty !== null && (
        <>
          {/* Sección de Propietarios con Cards */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica mb-2">
                Propietarios de la Propiedad
              </h3>
              <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                Agrega la información de todos los propietarios de la propiedad
              </p>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-terrasacha-light/10 border border-terrasacha-light/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-terrasacha-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-terrasacha-primary text-xs sm:text-sm font-bold">
                      ℹ
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-terrasacha-primary font-typographica mb-1">
                    Información Importante
                  </h4>
                  <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-0">
                    Todos los propietarios de la propiedad deben ser
                    diligenciados en el sistema. Asegúrate de agregar la
                    información completa de cada propietario, incluyendo sus
                    datos personales y documentos de identificación.
                  </p>
                </div>
              </div>
            </div>

            {/* Cards de Propietarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {/* Card Postulante (solo si es tercero) */}
              {isThirdParty && (
                <div
                  onClick={() => !postulanteData && openModal("postulante")}
                  className={`group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 ${
                    postulanteData
                      ? "border-terrasacha-primary bg-terrasacha-primary/5 cursor-default"
                      : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 cursor-pointer"
                  }`}
                >
                  {postulanteData ? (
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                        Postulante (Yo)
                      </h4>
                      <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3">
                        {postulanteData.name}
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800 font-semibold font-typographica mb-0">
                          ⏳ En espera de validación
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-red-200 transition-colors">
                        <FaPlus className="text-red-600 text-lg sm:text-2xl" />
                      </div>
                      <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                        Postulante (Yo) <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                        Agregar mi información
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
                        <p className="text-xs text-red-800 font-semibold font-typographica mb-0">
                          ⚠️ Requerido
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Propietario Principal */}
              <div
                onClick={() => propietariosData.length === 0 && openModal("propietario")}
                className={`group p-6 border-2 rounded-xl transition-all duration-300 ${
                  propietariosData.length > 0
                    ? "border-terrasacha-primary bg-terrasacha-primary/5 cursor-default"
                    : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 cursor-pointer"
                }`}
              >
                {propietariosData.length > 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {isThirdParty ? "Propietario" : "Propietario (Yo)"}
                    </h4>
                    <p className="text-sm text-terrasacha-secondary1 font-typographica mb-3">
                      {propietariosData[0].name}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <p className="text-xs text-yellow-800 font-semibold font-typographica mb-0">
                        ⏳ En espera de validación
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                      <FaPlus className="text-red-600 text-2xl" />
                    </div>
                    <h4 className="text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {isThirdParty ? "Propietario" : "Propietario (Yo)"} <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-sm text-terrasacha-secondary1 font-typographica">
                      {isThirdParty
                        ? "Agregar propietario"
                        : "Agregar mi información"}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
                      <p className="text-xs text-red-800 font-semibold font-typographica mb-0">
                        ⚠️ Requerido
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cards de Propietarios Adicionales */}
              {propietariosData.slice(1).map((propietario, index) => (
                <div
                  key={propietario.id}
                  className="group p-4 sm:p-6 border-2 border-terrasacha-primary bg-terrasacha-primary/5 rounded-xl transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      Propietario {index + 2}
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3">
                      {propietario.name}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
                      <p className="text-xs text-yellow-800 font-semibold font-typographica mb-0">
                        ⏳ En espera de validación
                      </p>
                    </div>
                    <button
                      onClick={() => removePropietario(propietario.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-typographica"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {/* Card para Agregar Más Propietarios */}
              {showAddPropietario && (
                <div
                  onClick={() => openModal("propietario")}
                  className="group cursor-pointer p-4 sm:p-6 border-2 border-dashed border-terrasacha-light rounded-xl hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-terrasacha-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-terrasacha-primary/20 transition-colors">
                      <FaPlus className="text-terrasacha-primary text-lg sm:text-2xl" />
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      Agregar Propietario
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                      Agregar otro propietario
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                      <p className="text-xs text-blue-800 font-semibold font-typographica mb-0">
                        ℹ️ Opcional
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de propietarios existentes */}
            {owners.length > 0 && (
              <div className="space-y-3 mb-4 sm:mb-6">
                <h4 className="text-sm sm:text-md font-semibold text-terrasacha-primary font-typographica mb-3">
                  Propietarios Agregados
                </h4>
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border border-terrasacha-light rounded-lg bg-terrasacha-light/5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-semibold text-terrasacha-primary font-typographica">
                          {owner.name}
                        </h5>
                        <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                          {owner.email}
                        </p>
                        {owner.phone && (
                          <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                            {owner.phone}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => editOwner(index)}
                          className="px-2 sm:px-3 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica text-xs sm:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeOwner(index)}
                          className="px-2 sm:px-3 py-1 text-red-500 hover:bg-red-50 rounded font-typographica text-xs sm:text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Modal para agregar/editar propietario */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-terrasacha-primary font-typographica">
                      {modalTitle}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-terrasacha-secondary1 hover:text-terrasacha-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={currentOwner.name}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={currentOwner.email}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="email@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={currentOwner.phone}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  {/* Archivos */}
                  <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Cédula (Frente) *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "idFront",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Cédula (Reverso) *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "idBack",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Selfie *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "selfie",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 sm:px-6 py-2 text-terrasacha-secondary1 hover:bg-terrasacha-light/20 rounded-lg font-typographica text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={editingIndex >= 0 ? updateOwner : addOwner}
                      className="px-4 sm:px-6 py-2 bg-terrasacha-primary text-white rounded-lg hover:bg-terrasacha-primary/90 transition-colors font-typographica text-sm sm:text-base"
                    >
                      {editingIndex >= 0 ? "Actualizar" : "Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
