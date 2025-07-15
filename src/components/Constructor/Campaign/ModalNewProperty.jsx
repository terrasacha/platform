import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createProperty, createPropertyFeature } from "graphql/mutations";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { useNavigate } from "react-router"; 
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { XIcon } from "components/common/icons/XIcon";
import { FaCheck, FaTimes, FaLeaf } from "react-icons/fa";

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
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá",
  "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare",
  "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo",
  "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada"
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

  const removeCadastralNumber = (index) => {
    const updatedNumbers = formData.cadastralNumbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      cadastralNumbers: updatedNumbers,
    });
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-nuevo-predio-title"
        centered
        show={showModal}
        onHide={handleClose}
        contentClassName="rounded-2xl shadow-2xl border-0"
      >
        <Modal.Header closeButton className="bg-green-50 border-0 rounded-t-2xl flex items-center gap-3">
          <FaLeaf className="text-green-600 text-2xl mr-2" aria-hidden="true" />
          <div>
            <Modal.Title id="modal-nuevo-predio-title" className="text-2xl font-bold text-green-800">
              Postular nuevo predio
            </Modal.Title>
            <div className="text-sm text-gray-600 font-normal mt-1">
              Completa la información para comenzar el registro de tu predio en la plataforma.
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="py-6 px-4 md:px-8">
          <Form className="space-y-5">
            <Form.Group controlId="propertyName">
              <Form.Label className="font-semibold text-gray-700">Nombre del predio</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Finca El Paraíso"
                aria-label="Nombre del predio"
                aria-invalid={!!fieldErrors.name}
                className={`rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition w-full ${fieldErrors.name ? "border-red-400" : ""}`}
                required
              />
              {fieldErrors.name && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>
              )}
            </Form.Group>
            <Form.Group controlId="propertyDescription">
              <Form.Label className="font-semibold text-gray-700">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe brevemente el predio, ubicación, uso, etc."
                aria-label="Descripción del predio"
                aria-invalid={!!fieldErrors.description}
                className={`rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition w-full ${fieldErrors.description ? "border-red-400" : ""}`}
                required
              />
              {fieldErrors.description && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.description}</div>
              )}
            </Form.Group>
            <Form.Group controlId="propertyDepartment">
              <Form.Label className="font-semibold text-gray-700">Departamento</Form.Label>
              <Form.Control
                as="select"
                name="department"
                value={formData.department}
                onChange={handleChange}
                aria-label="Departamento"
                aria-invalid={!!fieldErrors.department}
                className={`rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition w-full ${fieldErrors.department ? "border-red-400" : ""}`}
                required
              >
                <option value="">Seleccione un departamento</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </Form.Control>
              {fieldErrors.department && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.department}</div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <hr className="my-0 border-t border-gray-200" />
        <div className="flex flex-col md:flex-row gap-3 justify-between bg-gray-50 rounded-b-2xl border-0 px-4 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition w-full md:w-auto"
            aria-label="Cerrar modal"
          >
            <FaTimes className="text-base" />
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition shadow-md w-full md:w-auto disabled:opacity-60"
            aria-label="Postular predio"
          >
            {loading ? <Spinner animation="border" size="sm" /> : <FaCheck className="text-base" />}
            {loading ? "Postulando..." : "Postular"}
          </button>
        </div>
      </Modal>

      {/* Modal para errores */}
      <Modal
        centered
        show={errorModal.show}
        onHide={() => setErrorModal({ show: false, message: "" })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorModal.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setErrorModal({ show: false, message: "" })}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

