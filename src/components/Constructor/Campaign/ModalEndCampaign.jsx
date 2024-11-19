import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCampaign, createProduct } from 'graphql/customMutations';
export default function ModalEndCampaign({fetchCampaign, showModalEndCampaign, handleCloseEndCampaign, campaign}) {
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const inputUpdate = {
            id: campaign.id,
            available: false,
            };
            
            await API.graphql(graphqlOperation(updateCampaign, { input: inputUpdate }));
            await API.graphql(graphqlOperation(createProduct, { input:{
                name: `product-campaign-${campaign.id}`,
                description: "",
                isActive: false,
                categoryID: "MIXTO",
                campaignID: campaign.id
            }}))
            await fetchCampaign()
            handleCloseEndCampaign();
        } catch (error) {
            console.error("Error al actualizar la campaña:", error);
        } finally {
            setLoading(false);
        }
        };
    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showModalEndCampaign} onHide={handleCloseEndCampaign}>
        <Modal.Header closeButton>
            <Modal.Title as="h1" className='text-lg text-gray-700'>
            Finalizar campaña
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Una vez finalizada, no será posible continuar con la validación de predios, y se avanzará a la siguiente etapa del proceso.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEndCampaign}>
            Cancelar
            </Button>
            <Button variant="danger" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Finalizar campaña"}
            </Button>
        </Modal.Footer>
        </Modal>
    );
}
