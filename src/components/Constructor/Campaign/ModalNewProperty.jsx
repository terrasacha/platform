import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createProperty } from "graphql/mutations";
import { Trash } from "react-bootstrap-icons";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

const initialForm = {
  userID: "",
  campaignID: "",
  name: "",
  cadastralNumbers: [""],
  status: "PENDING",
  files: JSON.stringify([]),
};

export default function ModalNewProperty({
  showModal,
  handleClose,
  campaignId,
  fetchCampaign
}) {
  const [loading, setLoading] = useState(false);
  const userID = useRef(null);
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((data) => {
      userID.current = data.attributes.sub;
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const newProperty = {
        name: formData.name,
        cadastralNumber: JSON.stringify(formData.cadastralNumbers),
        campaignID: campaignId,
        userID: userID.current,
        status: formData.status,
      };

      const result = await API.graphql(
        graphqlOperation(createProperty, { input: newProperty })
      );
      const propertyId = result.data.createProperty.id;

      await fetchCampaign();
      handleClose();
  
      toast.success('Predio postulado con éxito, serás redirigido ...',{
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        navigate(`/property/${propertyId}`)
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar la campaña:", error);
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
  };

  const handleCadastralChange = (e, index) => {
    const updatedNumbers = [...formData.cadastralNumbers];
    updatedNumbers[index] = e.target.value;
    setFormData({
      ...formData,
      cadastralNumbers: updatedNumbers,
    });
  };

  // Agregar un nuevo campo de identificador catastral
  const addCadastralNumber = () => {
    setFormData({
      ...formData,
      cadastralNumbers: [...formData.cadastralNumbers, ""],
    });
  };

  // Eliminar un campo de identificador catastral
  const removeCadastralNumber = (index) => {
    const updatedNumbers = formData.cadastralNumbers.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      cadastralNumbers: updatedNumbers,
    });
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={showModal}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h1" className="text-lg text-gray-700">
          Postular nuevo predio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="pb-4" controlId="cadastralNumber">
            <Form.Label>Nombre del predio</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="pb-4" controlId="cadastralNumbers">
            <Form.Label>Identificadores catastrales</Form.Label>
            {formData.cadastralNumbers.map((cadastralNumber, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  name={`cadastralNumber-${index}`}
                  value={cadastralNumber}
                  onChange={(e) => handleCadastralChange(e, index)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => removeCadastralNumber(index)}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addCadastralNumber}
            >
              Agregar identificador
            </button>
          </Form.Group>

          {/* <Form.Group className='pb-4' controlId="images">
            <Form.Label>Certificado de tradición</Form.Label>
            <Form.Control
              type="file"
              name="files"
              multiple
              onChange={handleChange}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Postular"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
