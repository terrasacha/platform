import React from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { updateNotification } from "graphql/mutations";

export default function NotificationsModal({ show, onClose, messages, fetchPendingMessages, userId }) {
  const navigate = useNavigate();

  const markAsRead = async (notificationId) => {
    try {
      const response = await API.graphql(
        graphqlOperation(updateNotification, {
          input: {
            id: notificationId,
            isRead: true,
          },
        })
      );
      if (response?.data?.updateNotification) {
        await fetchPendingMessages(userId);
      }
    } catch (error) {
      console.error("❌ Error al actualizar la notificación:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter((msg) => !msg.isRead);
      await Promise.all(
        unreadMessages.map((msg) =>
          API.graphql(
            graphqlOperation(updateNotification, {
              input: { id: msg.id, isRead: true },
            })
          )
        )
      );
      await fetchPendingMessages(userId);
    } catch (error) {
      console.error("❌ Error al marcar todas como leídas:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="max-w-2xl">
      <Modal.Header closeButton className="bg-terrasacha-primary text-white border-0 rounded-t-2xl">
        <Modal.Title className="font-typographica font-bold text-xl">
          📩 Mensajes Pendientes
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-gradient-terrasacha-subtle p-6 max-h-96 overflow-y-auto">
        {messages.length > 0 && (
          <div className="flex justify-end mb-4">
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>Marcar todos como leídos</Tooltip>}
            >
              <Button
                variant="outline-success"
                size="sm"
                onClick={markAllAsRead}
                className="btn-terrasacha-outline"
              >
                ✅ Marcar todos
              </Button>
            </OverlayTrigger>
          </div>
        )}

        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="bg-white p-4 rounded-xl border-l-4 border-terrasacha-light shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <p className="font-typographica font-semibold text-terrasacha-secondary1 text-sm mb-2">
                  <strong>De:</strong> {msg.senderName || "Desconocido"}
                </p>
                <p className="text-terrasacha-secondary1 text-base mb-3 leading-relaxed">
                  {msg.message}
                </p>
                <p className="text-terrasacha-secondary1 opacity-80 text-xs mb-4">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString()
                    : "Fecha desconocida"}
                </p>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => markAsRead(msg.id)}
                    className="btn-terrasacha-success"
                  >
                    Marcar como leído
                  </Button>

                  {msg.propertyID ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        await markAsRead(msg.id);
                        let chatTargetParam = "";
                        if (msg.type === "MESSAGE_LEGAL") chatTargetParam = "legal";
                        else if (msg.type === "MESSAGE_VALIDATOR") chatTargetParam = "validator";

                        if (msg.type === "CAMPAING") {
                          navigate(`/campaign/${msg.propertyID}`);
                        } else if (msg.type === "PROPERTY") {
                          navigate(`/property/${msg.propertyID}`);
                        } else {
                          navigate(`/property/${msg.propertyID}?openChat=true&chatTarget=${chatTargetParam}`);
                        }
                      }}
                      className="btn-terrasacha-primary"
                    >
                      {msg.type === "CAMPAING"
                        ? "Ir a campaña"
                        : msg.type === "PROPERTY"
                        ? "Ir al predio"
                        : "Responder"}
                    </Button>
                  ) : (
                    <p className="text-terrasacha-secondary1 opacity-80 text-sm italic">
                      No se puede responder a este mensaje.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-terrasacha-secondary1 opacity-80 font-typographica text-lg">
              No tienes mensajes pendientes.
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-gradient-terrasacha-dark text-white border-0 rounded-b-2xl p-4 flex items-center justify-end gap-3 shadow-terrasacha">
        <Button 
          variant="secondary" 
          onClick={onClose} 
          className="btn-terrasacha-secondary"
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
