import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateProperty } from 'graphql/customMutations';
import { toast } from 'react-toastify';
import useFetchPropertiesCampaign from 'hooks/useFetchPropertiesCampaign';
import { useNavigate } from 'react-router';
const status = {
    REJECTED: 'REJECTED',
    ACCEPTED: 'APPROVED'
}
export default function ModalLogin({ showModal, handleClose }) {
    const navigate = useNavigate()
    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title as="h1" className="text-lg text-gray-700">
                    Restricción de acceso
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Para poder ver el detalle del proyecto usted debe estar logueado con una cuenta válida.
            </Modal.Body>
            <Modal.Footer>
                    <>
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Volver
                        </Button>
                        <Button variant="success" onClick={() => navigate('/login')}>
                            Ir al login
                        </Button>
                    </>
            </Modal.Footer>
        </Modal>
    );
}
