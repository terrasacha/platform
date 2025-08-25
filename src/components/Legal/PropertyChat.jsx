import React, { useEffect, useState, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useAuth } from "context/AuthContext";
import { notify } from "utilities/notify";
import {
  createNotification,
  createVerificationComment,
  updateNotification,
} from "graphql/mutations";
import { getProperty } from "utilities/customQueries";
import { listNotifications, listVerifications } from "graphql/queries";

export default function PropertyChat({ propertyId, featureChat, isValidatorAssigned }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [verificationID, setVerificationID] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableChatUsers, setAvailableChatUsers] = useState([]);
  const [verifierRole, setVerifierRole] = useState(null);
  const [propertyID, setPropertyID] = useState(null);
  const [propertyName, setPropertyName] = useState("");
  const messagesEndRef = useRef(null);
  const [userVerifiedName, setUserVerifiedName] = useState("");
  const [canUserWrite, setCanUserWrite] = useState(false);



  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
  
        if (!propertyId) {
          setLoading(false);
          return;
        }
  
        const response = await API.graphql(
          graphqlOperation(getProperty, { id: propertyId })
        );
  
        const property = response.data.getProperty;
        
        setPropertyID(property.id)
        setPropertyName(property.name);
        
        // Buscar la verificación específica para el featureChat
        const propertyVerification = property?.propertyFeatures?.items.find(
          (feature) => feature.featureID === featureChat
        )?.verifications?.items[0];
        
        setUserVerifiedName(propertyVerification?.userVerified?.name || "");
  
        if (!propertyVerification) {
          setVerificationID(null);
          setMessages([]);
          setLoading(false);
          return;
        }
  
        setVerificationID(propertyVerification.id);
  
        // Filtrar mensajes solo de la Verification correspondiente al featureChat
        const filteredMessages = propertyVerification.verificationComments?.items || [];
  
        // Ordenar mensajes por fecha de creación
        const sortedMessages = filteredMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
  
        setMessages(sortedMessages);
        setLoading(false);
  
        // Asignar usuarios disponibles en el chat
        const userVerifierId = propertyVerification?.userVerifierID;
        const userVerifiedId = propertyVerification.userVerifiedID;
        setAvailableChatUsers([userVerifierId, userVerifiedId]);
        setVerifierRole(propertyVerification?.userVerifier?.role);
              } catch (error) {
          console.error("Error fetching messages:", error);
          notify({ msg: "Error al cargar los mensajes", type: "error" });
          setLoading(false);
        }
    };
  
    fetchMessages();
  }, [propertyId, featureChat]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (propertyID) {
      notificationsRead();
    }
  }, [propertyID]);
  
  // ✅ CORREGIDO: useEffect para controlar permisos de escritura
  useEffect(() => {
    // ✅ CORREGIDO: Lógica simplificada y correcta
    if (user?.role === "validator") {
      // Validador: Solo si está asignado
      setCanUserWrite(isValidatorAssigned);
    } else if (user?.role === "constructor") {
      // Propietario: SIEMPRE puede escribir
      setCanUserWrite(true);
    } else {
      // Otros roles: Solo si están en availableChatUsers
      setCanUserWrite(availableChatUsers.includes(user?.id));
    }
  }, [isValidatorAssigned, availableChatUsers, user?.id, user?.role]);

  // ✅ NUEVO: useEffect para verificar si el validador ya está asignado en la verification
  useEffect(() => {
    if (user?.role === "validator" && verificationID && !isValidatorAssigned) {
      // Verificar si el validador ya está asignado en la verification actual
      const checkValidatorAssignment = async () => {
        try {
          const response = await API.graphql(
            graphqlOperation(listVerifications, {
              filter: { id: { eq: verificationID } }
            })
          );
          
          const verification = response.data.listVerifications.items[0];
          if (verification?.userVerifierID === user.id) {
            // ✅ El validador ya está asignado, habilitar escritura
            setCanUserWrite(true);
          }
        } catch (error) {
          console.error("Error verificando asignación del validador:", error);
        }
      };
      
      checkValidatorAssignment();
    }
  }, [user?.role, verificationID, isValidatorAssigned, user?.id]);
  


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const commentData = {
      verificationID: verificationID, // O el ID de la verificación correspondiente
      comment: newMessage,
      isCommentByVerifier: user.role === "legal" || user.role === "validator", // Asumiendo que el usuario Legal está enviando el mensaje
    };

    const notificationData = {
      userOriginID: user.id,
      userID:
        user.id === availableChatUsers[1]
          ? (availableChatUsers[0] || '')
          : availableChatUsers[1], // ID del usuario que debe recibir la notificación
      message: `Tienes un nuevo mensaje en el predio: ${propertyName}`,
      type:
      verifierRole === "legal"
        ? "MESSAGE_LEGAL"
        : verifierRole === "validator"
        ? "MESSAGE_VALIDATOR"
        : "MESSAGE",    
      resourceID: propertyID,
      isRead: false,
    };

    try {
      await API.graphql(
        graphqlOperation(createVerificationComment, { input: commentData })
      );

      if(availableChatUsers[0]) {
        await API.graphql(
          graphqlOperation(createNotification, { input: notificationData })
        );
      }
      
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          comment: newMessage,
          createdAt: new Date().toISOString(),
          isCommentByVerifier:
            user.role === "legal" || user.role === "validator",
        },
      ]);
      setNewMessage("");
      notify({ msg: "Mensaje enviado", type: "success" });
    } catch (error) {
      console.error("Error sending message:", error);
      notify({ msg: "Error al enviar el mensaje", type: "error" });
    }
  };

  const roleMapper = {
    admon: "Administrador",
    analyst: "Analista",
    legal: "Legal",
    constructor: "Propietario",
    validator: "Validador",
  };

  const notificationsRead = async () => {
    if (!propertyID || !user?.id) return;
  
    try {
      // Obtener las notificaciones del usuario relacionadas con el propertyID
      const response = await API.graphql(
        graphqlOperation(listNotifications, {
          filter: {
            userID: { eq: user.id },
            resourceID: { eq: propertyID }, // Solo notificaciones de este predio
            isRead: { eq: false }, // Solo las no leídas
          },
        })
      );
  
      const notifications = response?.data?.listNotifications?.items || [];
  
      // Actualizar cada notificación a isRead: true
      for (let notification of notifications) {
        await API.graphql(
          graphqlOperation(updateNotification, {
            input: { id: notification.id, isRead: true },
          })
        );
      }
  
      console.log("Notificaciones marcadas como leídas para propertyID:", propertyID);
    } catch (error) {
      console.error("Error marcando notificaciones como leídas:", error);
    }
  };
  
  return (
    <>


              {/* Mostrar chat siempre, con diferentes estados */}
      <div className="bg-white p-3 border rounded-md shadow-sm h-96 flex flex-col">
        <h2 className="text-lg font-bold mb-2">Mensajería</h2>
        
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Cargando mensajes...</p>
          </div>
        ) : !verificationID ? (
          <div className="flex-grow flex items-center justify-center">
                         <div className="text-center text-gray-500">
               <p>No se encontró verificación para el chat</p>
               <p className="text-sm">featureChat: {featureChat}</p>
               <p className="text-sm">propertyId: {propertyId}</p>
             </div>
          </div>
        ) : (
          <>
            <div className="flex-grow max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">No hay mensajes aún</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded-md ${
                      message.isCommentByVerifier ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <p className="font-semibold mb-0">
                      {message.isCommentByVerifier
                        ? roleMapper[verifierRole] || 'Verificador'
                        : userVerifiedName || 'Usuario'}
                      :
                    </p>
                    <p className="mb-0">{message.comment}</p>
                    <p className="text-sm text-gray-500 mb-0 text-right">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="border border-gray-300 rounded-md p-2 flex-grow"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!canUserWrite}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                onClick={handleSendMessage}
                disabled={!canUserWrite}
              >
                Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
