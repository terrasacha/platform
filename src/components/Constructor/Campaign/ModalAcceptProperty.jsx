import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCampaign } from 'graphql/customMutations';
export default function ModalAcceptProperty({showModalAcceptProperty, handleCloseModalAcceptProperty}) {
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);

    const handleReject = () =>{
        setLoadingReject(true)
        setTimeout(() => {
            setLoadingReject(false)
            handleCloseModalAcceptProperty()
        }, 2000);
    }
    const handleAccept = () =>{
        setLoadingAccept(true)
        setTimeout(() => {
            setLoadingAccept(false)
            handleCloseModalAcceptProperty()
        }, 2000);
    }
    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showModalAcceptProperty} onHide={handleCloseModalAcceptProperty}>
        <Modal.Header closeButton>
            <Modal.Title as="h1" className='text-lg text-gray-700'>
            Validación de predio
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Una vez finalizada, no será posible continuar con la validación de predios, y se avanzará a la siguiente etapa del proceso.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModalAcceptProperty} disabled={loadingAccept || loadingReject}>
            Cancelar
            </Button>
            <Button variant='danger' onClick={handleReject} disabled={loadingAccept || loadingReject}>
                {loadingReject ? <Spinner animation="border" size="sm" /> : "Rechazar"}
            </Button>
            <Button variant='success' onClick={handleAccept} disabled={loadingAccept || loadingReject}>
                {loadingAccept ? <Spinner animation="border" size="sm" /> : "Aceptar"}
            </Button>
        </Modal.Footer>
        </Modal>
    );
}
