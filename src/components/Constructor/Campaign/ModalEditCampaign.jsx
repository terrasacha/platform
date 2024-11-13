import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCampaign } from 'graphql/customMutations';

export default function ModalEditCampaign({ showModal, handleClose, campaign, fetchCampaign }) {
  const [description, setDescription] = useState(campaign.description || '');
  const [endDate, setEndDate] = useState(campaign.endDate ? new Date(campaign.endDate * 1000).toISOString().split('T')[0] : '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal && campaign) {
      setDescription(campaign.description || '');
      setEndDate(campaign.endDate ? new Date(campaign.endDate * 1000).toISOString().split('T')[0] : '');
    }
  }, [showModal, campaign]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const timestampData = {
        id: campaign.id,
        description,
        endDate: endDate ? Math.floor(new Date(endDate).getTime() / 1000) : null,
      };
      
      await API.graphql(graphqlOperation(updateCampaign, { input: timestampData }));
      await fetchCampaign()
      handleClose();
    } catch (error) {
      console.error("Error al actualizar la campaña:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as="h1" className='text-lg text-gray-700'>
          Editar convocatoria <span className='text-lg text-gray-700'>{campaign.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='pb-4' controlId="description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingrese una descripción"
              required
              className="h-28"
            />
          </Form.Group>

          <Form.Group className='pb-4' controlId="endDate">
            <Form.Label>Fecha de finalización</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
