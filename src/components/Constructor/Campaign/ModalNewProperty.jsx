import React, { useState, useEffect, useRef } from "react";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { createProperty, createDocument } from "graphql/mutations";
import { useNavigate } from "react-router";
import { FaCheck, FaTimes, FaBuilding, FaCamera, FaRedo } from "react-icons/fa";
import Webcam from "react-webcam";

const initialForm = {
  userID: "",
  campaignID: "",
  name: "",
  description: "",
  department: "",
  status: "PENDING",
  files: JSON.stringify([]),
  isThirdParty: false,
  userCedulaFront: null,
  userCedulaBack: null,
  thirdPartyCedulaFront: null,
  thirdPartyCedulaBack: null,
  userSelfie: null,
  thirdPartySelfie: null,
};

const departments = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

export default function ModalNewProperty({
  showModal,
  handleClose,
  campaignId,
  productId,
  fetchCampaign,
}) {
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const userID = useRef(null);
  const navigate = useNavigate();
  //const [predialFetchedData, setPredialFetchedData] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  // Estados para las cámaras
  const [showUserCamera, setShowUserCamera] = useState(false);
  const [showThirdPartyCamera, setShowThirdPartyCamera] = useState(false);
  const [capturedUserSelfie, setCapturedUserSelfie] = useState(null);
  const [capturedThirdPartySelfie, setCapturedThirdPartySelfie] =
    useState(null);

  // Referencias para las cámaras
  const userWebcamRef = useRef(null);
  const thirdPartyWebcamRef = useRef(null);

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const data = await Auth.currentAuthenticatedUser();
        userID.current = data.attributes.sub;
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };

    fetchAuthenticatedUser();
  }, []);

  const findFirstDuplicate = (arr) => {
    const set = new Set();
    for (const value of arr) {
      if (set.has(value)) return value;
      set.add(value);
    }
    return null;
  };

  const isPropertyNameDuplicate = async (name) => {
    try {
      const result = await API.graphql(
        graphqlOperation(
          `
          query CheckPropertyName($name: String!, $userID: ID!) {
            listProperties(filter: { name: { eq: $name }, userID: { eq: $userID } }) {
          query CheckPropertyName($name: String!, $userID: ID!) {
            listProperties(filter: { name: { eq: $name }, userID: { eq: $userID } }) {
              items {
                id
              }
            }
          }
          `,
          { name, userID: userID.current }
        )
      );

      return result.data.listProperties.items.length > 0;
    } catch (error) {
      console.error("Error verifying property name:", error);
      return false;
    }
  };

  const showError = (message) => {
    setErrorModal({ show: true, message }); // Mostrar el popup de error
  };

  // Función para subir archivo a S3
  const uploadFileToS3 = async (file, fileName, propertyId) => {
    try {
      const key = `properties/${propertyId}/documents/${fileName}`;
      const result = await Storage.put(key, file, {
        contentType: file.type,
        level: 'private'
      });
      return result.key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  };

  // Función para crear documento en la base de datos
  const createDocumentRecord = async (s3Key, propertyId, documentType) => {
    try {
      // Obtener la URL pública del archivo desde S3
      const s3Url = await Storage.get(s3Key, { level: 'private' });
      
      const documentData = {
        url: s3Url,
        data: JSON.stringify({
          type: documentType,
          uploadedAt: new Date().toISOString(),
          propertyId: propertyId,
          s3Key: s3Key
        }),
        timeStamp: Math.floor(Date.now() / 1000),
        isApproved: false,
        status: 'PENDING',
        visible: true,
        isUploadedToBlockChain: false
      };

      const result = await API.graphql(
        graphqlOperation(createDocument, { input: documentData })
      );
      return result.data.createDocument.id;
    } catch (error) {
      console.error('Error creating document record:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let errors = {};
    if (formData.name.trim() === "") {
      errors.name = "El nombre del predio es obligatorio.";
    }
    if (formData.description.trim() === "") {
      errors.description = "La descripción es obligatoria.";
    }
    if (formData.department === "") {
      errors.department = "Debe seleccionar un departamento.";
    }

    // Validaciones de archivos
    if (!formData.userCedulaFront) {
      errors.userCedulaFront =
        "Debe subir la foto de la cédula (frente) del usuario.";
    }
    if (!formData.userCedulaBack) {
      errors.userCedulaBack =
        "Debe subir la foto de la cédula (reverso) del usuario.";
    }

    // Si es a nombre de tercero, validar archivos del tercero
    if (formData.isThirdParty) {
      if (!formData.thirdPartyCedulaFront) {
        errors.thirdPartyCedulaFront =
          "Debe subir la foto de la cédula (frente) del tercero.";
      }
      if (!formData.thirdPartyCedulaBack) {
        errors.thirdPartyCedulaBack =
          "Debe subir la foto de la cédula (reverso) del tercero.";
      }
      if (!formData.thirdPartySelfie) {
        errors.thirdPartySelfie = "Debe subir una selfie del tercero.";
      }
    } else {
      // Si es a nombre propio, validar selfie del usuario
      if (!formData.userSelfie) {
        errors.userSelfie = "Debe subir una selfie del usuario.";
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    // Validar duplicado solo si hay una campaña asociada
    if (campaignId) {
      const isDuplicate = await isPropertyNameDuplicate(formData.name.trim());
      if (isDuplicate) {
        showError("El nombre del predio ya existe en esta campaña.");
        setLoading(false);
        return;
      }
    }

    // Validar identificadores catastrales duplicados
    // const duplicatedCadastralNumbers = findFirstDuplicate(formData.cadastralNumbers);
    //if (duplicatedCadastralNumbers) {
    //  showError(`Número catastral repetido. Nro: ${duplicatedCadastralNumbers}`);
    //   setLoading(false);
    //  return;
    // }

    try {
      // Crear objeto de predio sin incluir campaignID o productID si no existen
      const newProperty = {
        name: formData.name,
        description: formData.description,
        department: formData.department,
        userID: userID.current,
        status: formData.status,
      };

      if (campaignId) newProperty.campaignID = campaignId;
      if (productId) newProperty.productID = productId;

      // Obtener datos prediales
      //  const predialData = await getPredialDataByCadastralNumber(formData.cadastralNumbers);
      //  setPredialFetchedData(predialData);

      let totalArea = 0;
      //   const allGood = formData.cadastralNumbers.every((cadNum) => {
      //     if (predialData.hasOwnProperty(cadNum)) {
      //       totalArea += predialData[cadNum].AREA_TERRENO;
      //       return true;
      //     }
      //    return false;
      //   });

      //  if (!allGood) {
      //    showError("Identificador catastral no encontrado.");
      //    return;
      //  }

      // Crear predio en la base de datos
      const result = await API.graphql(
        graphqlOperation(createProperty, { input: newProperty })
      );
      const propertyId = result.data.createProperty.id;

      // Subir archivos a S3 y crear registros de documentos
      const uploadPromises = [];

      // Subir documentos del usuario
      if (formData.userCedulaFront) {
        uploadPromises.push(
          uploadFileToS3(formData.userCedulaFront, 'user-cedula-front.jpg', propertyId)
            .then(s3Key => createDocumentRecord(s3Key, propertyId, 'USER_CEDULA_FRONT'))
        );
      }

      if (formData.userCedulaBack) {
        uploadPromises.push(
          uploadFileToS3(formData.userCedulaBack, 'user-cedula-back.jpg', propertyId)
            .then(s3Key => createDocumentRecord(s3Key, propertyId, 'USER_CEDULA_BACK'))
        );
      }

      // Subir selfie del usuario (si no es tercero)
      if (!formData.isThirdParty && formData.userSelfie) {
        uploadPromises.push(
          uploadFileToS3(formData.userSelfie, 'user-selfie.jpg', propertyId)
            .then(s3Key => createDocumentRecord(s3Key, propertyId, 'USER_SELFIE'))
        );
      }

      // Subir documentos del tercero (si aplica)
      if (formData.isThirdParty) {
        if (formData.thirdPartyCedulaFront) {
          uploadPromises.push(
            uploadFileToS3(formData.thirdPartyCedulaFront, 'third-party-cedula-front.jpg', propertyId)
              .then(s3Key => createDocumentRecord(s3Key, propertyId, 'THIRD_PARTY_CEDULA_FRONT'))
          );
        }

        if (formData.thirdPartyCedulaBack) {
          uploadPromises.push(
            uploadFileToS3(formData.thirdPartyCedulaBack, 'third-party-cedula-back.jpg', propertyId)
              .then(s3Key => createDocumentRecord(s3Key, propertyId, 'THIRD_PARTY_CEDULA_BACK'))
          );
        }

        if (formData.thirdPartySelfie) {
          uploadPromises.push(
            uploadFileToS3(formData.thirdPartySelfie, 'third-party-selfie.jpg', propertyId)
              .then(s3Key => createDocumentRecord(s3Key, propertyId, 'THIRD_PARTY_SELFIE'))
          );
        }
      }

      // Esperar a que se suban todos los archivos
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // Si se postuló dentro de una campaña, actualizar datos
      if (campaignId) {
        await fetchCampaign();
      }

      //    setPredialFetchedData(null);
      setFormData(initialForm);
      handleClose();

      setTimeout(() => {
        navigate(`/property/${propertyId}`);
      }, 3000);
    } catch (error) {
      console.error("Error al postular el predio:", error);
      showError("Ocurrió un error al postular el predio. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFieldErrors({ ...fieldErrors, [name]: undefined });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      });
      setFieldErrors({ ...fieldErrors, [fieldName]: undefined });
    }
  };

  // Función para capturar foto del usuario
  const captureUserSelfie = () => {
    const imageSrc = userWebcamRef.current.getScreenshot();
    setCapturedUserSelfie(imageSrc);
    setShowUserCamera(false);

    // Convertir la imagen a File
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "user-selfie.jpg", {
          type: "image/jpeg",
        });
        setFormData({
          ...formData,
          userSelfie: file,
        });
        setFieldErrors({ ...fieldErrors, userSelfie: undefined });
      });
  };

  // Función para capturar foto del tercero
  const captureThirdPartySelfie = () => {
    const imageSrc = thirdPartyWebcamRef.current.getScreenshot();
    setCapturedThirdPartySelfie(imageSrc);
    setShowThirdPartyCamera(false);

    // Convertir la imagen a File
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "third-party-selfie.jpg", {
          type: "image/jpeg",
        });
        setFormData({
          ...formData,
          thirdPartySelfie: file,
        });
        setFieldErrors({ ...fieldErrors, thirdPartySelfie: undefined });
      });
  };

  // Función para reiniciar la captura del usuario
  const retakeUserSelfie = () => {
    setCapturedUserSelfie(null);
    setShowUserCamera(true);
    setFormData({
      ...formData,
      userSelfie: null,
    });
  };

  // Función para reiniciar la captura del tercero
  const retakeThirdPartySelfie = () => {
    setCapturedThirdPartySelfie(null);
    setShowThirdPartyCamera(true);
    setFormData({
      ...formData,
      thirdPartySelfie: null,
    });
  };

  const handleCadastralChange = (e, index) => {
    const updatedNumbers = [...formData.cadastralNumbers];
    updatedNumbers[index] = e.target.value;
    setFormData({
      ...formData,
      cadastralNumbers: updatedNumbers,
    });
  };

  const addCadastralNumber = () => {
    setFormData({
      ...formData,
      cadastralNumbers: [...formData.cadastralNumbers, ""],
    });
  };

  return (
    <>
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleClose}
            ></div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl md:max-w-4xl lg:max-w-5xl w-full">
              {/* Modal Header */}
              <div className="bg-gradient-terrasacha border-0 rounded-t-2xl flex items-center gap-3 p-6">
                <FaBuilding
                  className="text-terrasacha-earth text-2xl"
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-typographica font-bold text-white">
                    Postular nuevo predio
                  </h3>
                  <div className="text-sm text-terrasacha-light font-typographica font-normal mt-1">
                    Completa la información para comenzar el registro de tu
                    predio en la plataforma.
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-terrasacha-light transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-8 px-6 md:px-8 bg-gradient-terrasacha-subtle">
                <div className="space-y-6">
                  {/* Property Name Field */}
                  <div>
                    <label className="font-typographica font-semibold text-terrasacha-secondary1 text-lg block mb-2">
                      Nombre del predio
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej: Finca El Paraíso"
                      aria-label="Nombre del predio"
                      aria-invalid={!!fieldErrors.name}
                      className={`rounded-xl border-2 border-terrasacha-light focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 w-full p-4 font-typographica ${
                        fieldErrors.name ? "border-red-400" : ""
                      }`}
                      required
                    />
                    {fieldErrors.name && (
                      <div className="text-red-500 text-sm mt-2 font-typographica">
                        {fieldErrors.name}
                      </div>
                    )}
                  </div>

                  {/* Property Description Field */}
                  <div>
                    <label className="font-typographica font-semibold text-terrasacha-secondary1 text-lg block mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe brevemente el predio, ubicación, uso, etc."
                      aria-label="Descripción del predio"
                      aria-invalid={!!fieldErrors.description}
                      className={`rounded-xl border-2 border-terrasacha-light focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 w-full p-4 font-typographica resize-none ${
                        fieldErrors.description ? "border-red-400" : ""
                      }`}
                      required
                    />
                    {fieldErrors.description && (
                      <div className="text-red-500 text-sm mt-2 font-typographica">
                        {fieldErrors.description}
                      </div>
                    )}
                  </div>

                  {/* Department Field */}
                  <div>
                    <label className="font-typographica font-semibold text-terrasacha-secondary1 text-lg block mb-2">
                      Departamento
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      aria-label="Departamento"
                      aria-invalid={!!fieldErrors.department}
                      className={`rounded-xl border-2 border-terrasacha-light focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 w-full p-4 font-typographica ${
                        fieldErrors.department ? "border-red-400" : ""
                      }`}
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.department && (
                      <div className="text-red-500 text-sm mt-2 font-typographica">
                        {fieldErrors.department}
                      </div>
                    )}
                  </div>

                  {/* Third Party Checkbox */}
                  <div className="bg-white rounded-xl border-2 border-terrasacha-light p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isThirdParty"
                        checked={formData.isThirdParty}
                        onChange={handleChange}
                        className="w-5 h-5 text-terrasacha-primary bg-gray-100 border-gray-300 rounded focus:ring-terrasacha-primary focus:ring-2"
                        aria-label="Registro a nombre de tercero"
                      />
                      <span className="font-typographica font-semibold text-terrasacha-secondary1 text-lg">
                        El registro del predio es a nombre de un tercero
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 font-typographica mt-2 ml-8">
                      Marque esta opción si el predio será registrado a nombre
                      de otra persona
                    </p>
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <h3 className="font-typographica font-bold text-terrasacha-secondary1 text-xl border-b-2 border-terrasacha-light pb-2">
                      Documentos requeridos
                    </h3>

                    {/* User Documents */}
                    <div className="bg-white rounded-xl border-2 border-terrasacha-light p-4">
                      <h4 className="font-typographica font-semibold text-terrasacha-secondary1 text-lg mb-4">
                        Documentos del propietario
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Cedula Front */}
                        <div>
                          <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                            Cédula del usuario (frente)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "userCedulaFront")
                            }
                            className={`w-full p-3 border-2 border-terrasacha-light rounded-xl focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 font-typographica ${
                              fieldErrors.userCedulaFront
                                ? "border-red-400"
                                : ""
                            }`}
                            aria-label="Subir foto de cédula frente del usuario"
                            aria-invalid={!!fieldErrors.userCedulaFront}
                          />
                          {fieldErrors.userCedulaFront && (
                            <div className="text-red-500 text-sm mt-1 font-typographica">
                              {fieldErrors.userCedulaFront}
                            </div>
                          )}
                        </div>

                        {/* User Cedula Back */}
                        <div>
                          <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                            Cédula del usuario (reverso)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "userCedulaBack")
                            }
                            className={`w-full p-3 border-2 border-terrasacha-light rounded-xl focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 font-typographica ${
                              fieldErrors.userCedulaBack ? "border-red-400" : ""
                            }`}
                            aria-label="Subir foto de cédula reverso del usuario"
                            aria-invalid={!!fieldErrors.userCedulaBack}
                          />
                          {fieldErrors.userCedulaBack && (
                            <div className="text-red-500 text-sm mt-1 font-typographica">
                              {fieldErrors.userCedulaBack}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Selfie - Only show when NOT third party */}
                      {!formData.isThirdParty && (
                        <div className="mt-4">
                          <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                            Selfie del propietario
                          </label>

                          {!capturedUserSelfie && !showUserCamera && (
                            <button
                              type="button"
                              onClick={() => setShowUserCamera(true)}
                              className="w-full p-4 border-2 border-dashed border-terrasacha-light rounded-xl hover:border-terrasacha-primary hover:bg-terrasacha-light bg-white transition-all duration-300 font-typographica flex items-center justify-center gap-2"
                            >
                              <FaCamera className="text-terrasacha-primary text-xl" />
                              <span className="text-terrasacha-secondary1 font-medium">
                                Tomar selfie con la cámara
                              </span>
                            </button>
                          )}

                          {showUserCamera && (
                            <div className="border-2 border-terrasacha-light rounded-xl p-4 bg-white">
                              <div className="mb-4">
                                <h5 className="font-typographica font-semibold text-terrasacha-secondary1 text-base mb-2">
                                  Posicione su rostro en el centro de la
                                  pantalla
                                </h5>
                                <Webcam
                                  ref={userWebcamRef}
                                  audio={false}
                                  width={320}
                                  height={240}
                                  screenshotFormat="image/jpeg"
                                  videoConstraints={{
                                    width: 320,
                                    height: 240,
                                    facingMode: "user",
                                  }}
                                  className="rounded-lg mx-auto block"
                                />
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={captureUserSelfie}
                                  className="flex items-center gap-2 px-4 py-2 bg-terrasacha-primary text-white rounded-lg font-typographica font-medium hover:bg-terrasacha-secondary2 transition-colors"
                                >
                                  <FaCamera className="text-sm" />
                                  Capturar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowUserCamera(false)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-typographica font-medium hover:bg-gray-600 transition-colors"
                                >
                                  <FaTimes className="text-sm" />
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}

                          {capturedUserSelfie && (
                            <div className="border-2 border-terrasacha-light rounded-xl p-4 bg-white">
                              <div className="mb-4">
                                <h5 className="font-typographica font-semibold text-terrasacha-secondary1 text-base mb-2">
                                  Selfie capturada
                                </h5>
                                <img
                                  src={capturedUserSelfie}
                                  alt="Selfie del propietario"
                                  className="w-48 h-36 object-cover rounded-lg mx-auto block"
                                />
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={retakeUserSelfie}
                                  className="flex items-center gap-2 px-4 py-2 bg-terrasacha-secondary1 text-white rounded-lg font-typographica font-medium hover:bg-terrasacha-primary transition-colors"
                                >
                                  <FaRedo className="text-sm" />
                                  Tomar otra
                                </button>
                              </div>
                            </div>
                          )}

                          {fieldErrors.userSelfie && (
                            <div className="text-red-500 text-sm mt-2 font-typographica">
                              {fieldErrors.userSelfie}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Third Party Documents - Only show if isThirdParty is true */}
                    {formData.isThirdParty && (
                      <div className="bg-white rounded-xl border-2 border-terrasacha-light p-4">
                        <h4 className="font-typographica font-semibold text-terrasacha-secondary1 text-lg mb-4">
                          Documentos del tercero
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Third Party Cedula Front */}
                          <div>
                            <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                              Cédula del tercero (frente)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "thirdPartyCedulaFront")
                              }
                              className={`w-full p-3 border-2 border-terrasacha-light rounded-xl focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 font-typographica ${
                                fieldErrors.thirdPartyCedulaFront
                                  ? "border-red-400"
                                  : ""
                              }`}
                              aria-label="Subir foto de cédula frente del tercero"
                              aria-invalid={!!fieldErrors.thirdPartyCedulaFront}
                            />
                            {fieldErrors.thirdPartyCedulaFront && (
                              <div className="text-red-500 text-sm mt-1 font-typographica">
                                {fieldErrors.thirdPartyCedulaFront}
                              </div>
                            )}
                          </div>

                          {/* Third Party Cedula Back */}
                          <div>
                            <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                              Cédula del tercero (reverso)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "thirdPartyCedulaBack")
                              }
                              className={`w-full p-3 border-2 border-terrasacha-light rounded-xl focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 font-typographica ${
                                fieldErrors.thirdPartyCedulaBack
                                  ? "border-red-400"
                                  : ""
                              }`}
                              aria-label="Subir foto de cédula reverso del tercero"
                              aria-invalid={!!fieldErrors.thirdPartyCedulaBack}
                            />
                            {fieldErrors.thirdPartyCedulaBack && (
                              <div className="text-red-500 text-sm mt-1 font-typographica">
                                {fieldErrors.thirdPartyCedulaBack}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Third Party Selfie */}
                        <div className="mt-4">
                          <label className="font-typographica font-medium text-terrasacha-secondary1 text-base block mb-2">
                            Selfie del tercero
                          </label>

                          {!capturedThirdPartySelfie &&
                            !showThirdPartyCamera && (
                              <button
                                type="button"
                                onClick={() => setShowThirdPartyCamera(true)}
                                className="w-full p-4 border-2 border-dashed border-terrasacha-light rounded-xl hover:border-terrasacha-primary hover:bg-terrasacha-light bg-white transition-all duration-300 font-typographica flex items-center justify-center gap-2"
                              >
                                <FaCamera className="text-terrasacha-primary text-xl" />
                                <span className="text-terrasacha-secondary1 font-medium">
                                  Tomar selfie del tercero con la cámara
                                </span>
                              </button>
                            )}

                          {showThirdPartyCamera && (
                            <div className="border-2 border-terrasacha-light rounded-xl p-4 bg-white">
                              <div className="mb-4">
                                <h5 className="font-typographica font-semibold text-terrasacha-secondary1 text-base mb-2">
                                  Posicione el rostro del tercero en el centro
                                  de la pantalla
                                </h5>
                                <Webcam
                                  ref={thirdPartyWebcamRef}
                                  audio={false}
                                  width={320}
                                  height={240}
                                  screenshotFormat="image/jpeg"
                                  videoConstraints={{
                                    width: 320,
                                    height: 240,
                                    facingMode: "user",
                                  }}
                                  className="rounded-lg mx-auto block"
                                />
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={captureThirdPartySelfie}
                                  className="flex items-center gap-2 px-4 py-2 bg-terrasacha-primary text-white rounded-lg font-typographica font-medium hover:bg-terrasacha-secondary2 transition-colors"
                                >
                                  <FaCamera className="text-sm" />
                                  Capturar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowThirdPartyCamera(false)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-typographica font-medium hover:bg-gray-600 transition-colors"
                                >
                                  <FaTimes className="text-sm" />
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}

                          {capturedThirdPartySelfie && (
                            <div className="border-2 border-terrasacha-light rounded-xl p-4 bg-white">
                              <div className="mb-4">
                                <h5 className="font-typographica font-semibold text-terrasacha-secondary1 text-base mb-2">
                                  Selfie del tercero capturada
                                </h5>
                                <img
                                  src={capturedThirdPartySelfie}
                                  alt="Selfie del tercero"
                                  className="w-48 h-36 object-cover rounded-lg mx-auto block"
                                />
                              </div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={retakeThirdPartySelfie}
                                  className="flex items-center gap-2 px-4 py-2 bg-terrasacha-secondary1 text-white rounded-lg font-typographica font-medium hover:bg-terrasacha-primary transition-colors"
                                >
                                  <FaRedo className="text-sm" />
                                  Tomar otra
                                </button>
                              </div>
                            </div>
                          )}

                          {fieldErrors.thirdPartySelfie && (
                            <div className="text-red-500 text-sm mt-2 font-typographica">
                              {fieldErrors.thirdPartySelfie}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aviso UCC - Tratamiento de Datos */}
                <div
                  className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                  role="note"
                  aria-label="Aviso tratamiento de datos UCC"
                  tabIndex={0}
                >
                  <p className="text-xs text-gray-700 font-typographica leading-snug">
                    LA UNIVERSIDAD COOPERATIVA DE COLOMBIA – UCC le informa que
                    los datos personales que se recolectan a través del presente
                    formulario tienen como finalidad principal cumplir con la
                    obligación de esta institución de informarse y obtener
                    información veraz e imparcial de los grupos de interés con
                    los cuales se relaciona sobre la situación de riesgos
                    provenientes de las actividades clasificadas dentro del
                    sistema SARLAFT. En cumplimiento de esta finalidad principal
                    sus datos podrán ser incluidos en bases de datos de carácter
                    público y/o privado para verificar su situación de
                    cumplimiento; podrán ser cruzados entre bases de datos;
                    aplicarles herramientas de analítica y perfilamiento;
                    entregados a terceros proveedores de estos servicios y de
                    cualquiera otro encargado de acuerdo con los tratamientos
                    requeridos por LA UCC o los que llegaren a imponerse por las
                    normas y mejores prácticas internacionales en esta materia.
                    Para el ejercicio de sus derechos podrá remitir su petición
                    o reclamo a través del siguiente correo electrónico:
                    <a
                      href="mailto:habeas.data@ucc.edu.co"
                      className="text-terrasacha-primary underline ml-1"
                    >
                      habeas.data@ucc.edu.co
                    </a>{" "}
                    y puede consultar la Política de Privacidad de la
                    institución en{" "}
                    <a
                      href="https://www.ucc.edu.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terrasacha-primary underline"
                    >
                      www.ucc.edu.co
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <hr className="my-0 border-t border-terrasacha-light" />
              <div className="flex flex-col md:flex-row gap-4 justify-between bg-gradient-terrasacha border-0 rounded-b-2xl px-6 py-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-typographica font-semibold text-white bg-terrasacha-secondary1 hover:bg-terrasacha-primary focus:outline-none focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 shadow-terrasacha w-full md:w-auto transform hover:scale-105"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="text-base" />
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-typographica font-semibold text-white bg-terrasacha-secondary2 hover:bg-terrasacha-primary focus:outline-none focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 shadow-terrasacha w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                  aria-label="Postular predio"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Postulando...
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-base" />
                      Postular
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setErrorModal({ show: false, message: "" })}
            ></div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-terrasacha border-0 rounded-t-2xl p-6 flex items-center justify-between">
                <h3 className="text-xl font-typographica font-bold text-white">
                  Error
                </h3>
                <button
                  onClick={() => setErrorModal({ show: false, message: "" })}
                  className="text-white hover:text-terrasacha-light transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-gradient-terrasacha-subtle">
                <p className="text-terrasacha-secondary1 font-typographica">
                  {errorModal.message}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="bg-gradient-terrasacha border-t border-terrasacha-light rounded-b-2xl p-6">
                <button
                  onClick={() => setErrorModal({ show: false, message: "" })}
                  className="bg-red-600 hover:bg-red-700 text-white font-typographica font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-terrasacha"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
