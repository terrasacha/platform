import React, { useState, useEffect, useRef } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createProperty } from "graphql/mutations";
import { useNavigate } from "react-router";
import { FaCheck, FaTimes, FaBuilding } from "react-icons/fa";

const initialForm = {
  userID: "",
  campaignID: "",
  name: "",
  description: "",
  department: "",
  status: "PENDING",
  files: JSON.stringify([]),
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

      // Guardar identificadores catastrales como feature
      //   const cadastralNumbers = formData.cadastralNumbers.map((cadNum) => ({
      //     cadastralNumber: cadNum,
      //   }));

      //  const tempPropertyFeature = {
      //    value: JSON.stringify(cadastralNumbers),
      //    isToBlockChain: false,
      //    isOnMainCard: false,
      //    propertyID: propertyId,
      //    featureID: "A_predio_ficha_catastral",
      //  };
      //  await API.graphql(graphqlOperation(createPropertyFeature, { input: tempPropertyFeature }));

      // Guardar área total como feature
      //   const tempPropertyFeature2 = {
      //     value: totalArea,
      //     isToBlockChain: false,
      //     isOnMainCard: false,
      //     propertyID: propertyId,
      //     featureID: "D_area",
      //   };
      //   await API.graphql(graphqlOperation(createPropertyFeature, { input: tempPropertyFeature2 }));

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
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                    Completa la información para comenzar el registro de tu predio en
                    la plataforma.
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
