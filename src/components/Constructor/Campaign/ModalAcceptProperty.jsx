import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCampaign } from 'graphql/customMutations';
import { toast } from 'react-toastify';
const status = {
    REJECTED: 'rejected',
    ACCEPTED: 'accepted'
}
export default function ModalAcceptProperty({ showModalAcceptProperty, handleCloseModalAcceptProperty, selectedProperty }) {
    const [selection, setSelection] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");

    const handleReject = () => {
        setSelection(status.REJECTED)
        setShowConfirmation(true);
    };

    const handleAccept = () => {
        setSelection(status.ACCEPTED)
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        setLoading(true)
        setTimeout(() => {
            handleCloseModalAcceptProperty();
            setShowConfirmation(false);
            setLoading(false)
            toast.success('Validación completada')

            setSelection(null)
            setConfirmationText("");
        }, 2000);
        /* try {
            await API.graphql(graphqlOperation(updateCampaign, {
                input: {
                    id: selectedProperty.id,
                    status: action,
                    confirmationText: confirmationText,
                }
            }));
            handleCloseModalAcceptProperty();
        } catch (error) {
            console.error("Error actualizando la campaña:", error);
        } finally {
            setShowConfirmation(false);
            setConfirmationText("");
        } */
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setConfirmationText("");
    };

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showModalAcceptProperty} onHide={handleCloseModalAcceptProperty}>
            <Modal.Header closeButton>
                <Modal.Title as="h1" className="text-lg text-gray-700">
                    Validación de predio
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showConfirmation ? (
                    <>
                        <Form.Group controlId="confirmationText">
                            <Form.Label>Escriba sus comentarios:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder="De una breve razón de su decisión"
                            />
                        </Form.Group>
                    </>
                ) : (
                    "Al aceptar o rechazar usted confirma haber revisado toda la información disponible del predio hasta el momento."
                )}
            </Modal.Body>
            <Modal.Footer>
                {showConfirmation ? (
                    <>
                        <Button variant="outline-secondary" onClick={handleCancel} >
                            Cancelar
                        </Button>
                        <Button variant={status.REJECTED === selection ? "danger" : "success"} onClick={handleConfirm} disabled={!confirmationText}>
                            {loading ? <Spinner animation="border" size="sm" /> : `Confirmar ${status.REJECTED === selection ? "rechazo" : "aceptación"}`}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline-secondary" onClick={handleCloseModalAcceptProperty}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleReject}>
                            Rechazar
                        </Button>
                        <Button variant="success" onClick={handleAccept}>
                            Aceptar
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
