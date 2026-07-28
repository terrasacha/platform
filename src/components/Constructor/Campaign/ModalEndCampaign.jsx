import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCampaign } from 'graphql/customMutations';
import { convocatoriaActions } from 'utilities/campaignStatusMapper';

export default function ModalEndCampaign({fetchCampaign, showModalEndCampaign, handleCloseEndCampaign, campaign}) {
    const [loading, setLoading] = useState(false);
    const pendingProperties = campaign?.properties?.items?.filter(property => property.status.toUpperCase() === "PENDING") || [];
    const handleSave = async () => {
        setLoading(true);
        try {
            const inputUpdate = {
            id: campaign.id,
            available: false,
            };
            
            await API.graphql(graphqlOperation(updateCampaign, { input: inputUpdate }));
            await fetchCampaign()
            handleCloseEndCampaign();
        } catch (error) {
            console.error("Error al actualizar la campaña:", error);
        } finally {
            setLoading(false);
        }
        };
    return (
        <Modal
            aria-labelledby="modal-cerrar-convocatoria-title"
            centered
            show={showModalEndCampaign}
            onHide={handleCloseEndCampaign}
        >
            <Modal.Header closeButton>
                <Modal.Title as="h1" id="modal-cerrar-convocatoria-title" className="text-lg text-gray-700">
                    {convocatoriaActions.closeModalTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {pendingProperties.length > 0 ? (
                    <>
                        <p className="mb-2 font-semibold text-red-600">
                            {convocatoriaActions.closeWithPendingIntro}
                        </p>
                        <ul className="list-disc pl-5 text-gray-600">
                            {pendingProperties.map((property) => (
                                <li key={property.id} className="text-gray-700">
                                    {property.name}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-3 text-sm text-gray-600">
                            {convocatoriaActions.closeConfirmMessage}
                        </p>
                        <p className="mt-3 font-semibold text-gray-800">
                            {convocatoriaActions.closeWithPendingQuestion}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="mb-3 text-gray-700">
                            No hay predios pendientes por aprobar.
                        </p>
                        <p className="mb-3 text-sm text-gray-600">
                            {convocatoriaActions.closeConfirmMessage}
                        </p>
                        <p className="mb-0 font-semibold text-gray-800">
                            {convocatoriaActions.closeConfirmQuestion}
                        </p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEndCampaign}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleSave} disabled={loading}>
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        convocatoriaActions.closeButtonLabel
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
