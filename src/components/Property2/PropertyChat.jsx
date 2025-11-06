import React, { useEffect, useState, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { toast } from "react-toastify";
import {
  createNotification,
  createVerificationComment,
  updateNotification,
  createPropertyFeature,
  createVerification,
} from "graphql/mutations";
import { listNotifications } from "graphql/queries";
import {
  FaPaperPlane,
  FaComments,
  FaUser,
} from "react-icons/fa";

const roleMapper = {
  admon: "Administrador",
  analyst: "Analista",
  legal: "Revisor Legal",
  constructor: "Propietario",
  validator: "Consultor",
  propietario: "Propietario",
  investor: "Inversor",
};

export default function PropertyChat() {
  const { user } = useAuth();
  const { propertyData, refresh: refreshPropertyData } = usePropertyData();
  const [messages, setMessages] = useState([]);
  const [verificationID, setVerificationID] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [availableChatUsers, setAvailableChatUsers] = useState([]);
  const [verifierRole, setVerifierRole] = useState(null);
  const [userVerifiedName, setUserVerifiedName] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      // Esperar a que propertyData esté disponible
      if (!propertyData || !propertyData?.propertyInfo?.id || !user?.id) {
        console.log("⏳ Esperando propertyData o user...");
        return;
      }

      try {
        setLoading(true);
        console.log("🚀 Iniciando carga de mensajes para property:", propertyData.propertyInfo.id);

        // Refrescar propertyData para tener los datos más recientes
        if (refreshPropertyData) {
          console.log("🔄 Refrescando propertyData...");
          await refreshPropertyData();
        }

        // Buscar el feature GLOBAL_PROPERTY_CHAT en propertyData
        const chatFeature = propertyData?.propertyFeatures?.find(
          (feature) => feature.featureID === "GLOBAL_PROPERTY_CHAT"
        );

        // Si no existe el feature, no hacer nada - se creará al enviar el primer mensaje
        if (!chatFeature) {
          console.log("ℹ️ No hay feature GLOBAL_PROPERTY_CHAT aún. Se creará al enviar el primer mensaje.");
          setVerificationID(null);
          setMessages([]);
          setLoading(false);
          return;
        }

        console.log("✅ Feature encontrado en propertyData:", chatFeature.id);

        // Buscar el verification asociado en propertyData
        let propertyVerification = null;

        if (chatFeature?.verifications?.items && chatFeature.verifications.items.length > 0) {
          // Si hay múltiples verifications, usar el más antiguo
          const existingVerifications = [...chatFeature.verifications.items];
          existingVerifications.sort((a, b) => 
            new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          );
          propertyVerification = existingVerifications[0];
          console.log("✅ Verification encontrado en propertyData:", propertyVerification.id);
          console.log("📋 VerificationComments en verification:", propertyVerification?.verificationComments?.items?.length || 0);
          
          // Log de los comentarios si existen
          if (propertyVerification?.verificationComments?.items?.length > 0) {
            console.log("📝 Comentarios encontrados en verification:", propertyVerification.verificationComments.items.map(c => ({
              id: c.id,
              comment: c.comment?.substring(0, 30),
              isCommentByVerifier: c.isCommentByVerifier
            })));
          }
        }

        // NO crear verification aquí - se creará al enviar el primer mensaje
        if (!propertyVerification) {
          console.log("ℹ️ No hay Verification aún. Se creará al enviar el primer mensaje.");
          setVerificationID(null);
          setMessages([]);
          setLoading(false);
          return;
        }

        setVerificationID(propertyVerification.id);
        setUserVerifiedName(propertyVerification?.userVerified?.name || "");

        // Cargar mensajes desde verificationComments del verification en propertyData
        let sortedMessages = [];
        
        if (propertyVerification?.verificationComments?.items && propertyVerification.verificationComments.items.length > 0) {
          console.log("✅ Usando verificationComments del verification en propertyData");
          const directComments = propertyVerification.verificationComments.items || [];
          console.log("📝 Comentarios encontrados:", directComments.length);
          
          sortedMessages = directComments
            .map((comment, idx) => {
              // Generar ID único si no existe
              const commentId = comment.id || `comment-${propertyVerification.id}-${idx}-${comment.createdAt || Date.now()}`;
              return {
                id: commentId,
                comment: comment.comment || "",
                isCommentByVerifier: comment.isCommentByVerifier || false,
                verificationID: comment.verificationID || propertyVerification.id,
                createdAt: comment.createdAt || new Date().toISOString(),
                updatedAt: comment.updatedAt || new Date().toISOString(),
                userID: propertyVerification.userVerifiedID,
              };
            })
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
          console.log("⚠️ No se encontraron comentarios en verificationComments");
          sortedMessages = [];
        }
        
        console.log("✅ Mensajes procesados y ordenados:", sortedMessages.length);
        if (sortedMessages.length > 0) {
          console.log("📋 Primeros mensajes:", sortedMessages.slice(0, 3).map(m => ({ 
            id: m.id, 
            comment: m.comment?.substring(0, 50),
            isCommentByVerifier: m.isCommentByVerifier,
            createdAt: m.createdAt
          })));
        }

        setMessages(sortedMessages);

        // Asignar usuarios disponibles en el chat
        const projectVerifiers = propertyData?.projectVerifiers || [];
        const projectPostulant = propertyData?.projectPostulant?.id;
        const userVerifierId = propertyVerification?.userVerifierID;
        const userVerifiedId = propertyVerification.userVerifiedID;
        
        const allUsers = [
          ...projectVerifiers,
          ...(projectPostulant ? [projectPostulant] : []),
          userVerifierId,
          userVerifiedId,
        ].filter(Boolean);
        
        setAvailableChatUsers([...new Set(allUsers)]);
        setVerifierRole(propertyVerification?.userVerifier?.role);

        console.log("✅ Chat inicializado:");
        console.log("  - VerificationID:", propertyVerification.id);
        console.log("  - Mensajes:", sortedMessages.length);
        console.log("  - Usuarios:", [...new Set(allUsers)]);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
        toast.error("Error al cargar los mensajes");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyData?.propertyInfo?.id, user?.id]);

  // Ref para controlar si debe hacer scroll (solo cuando se envía un nuevo mensaje)
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    // Solo hacer scroll si shouldScrollRef está activo (mensaje nuevo enviado)
    if (shouldScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      shouldScrollRef.current = false; // Resetear después de hacer scroll
    }
  }, [messages]);

  useEffect(() => {
    if (propertyData?.propertyInfo?.id && user?.id) {
      notificationsRead();
    }
  }, [propertyData?.propertyInfo?.id, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!user?.id) {
      toast.error("Error: No se pudo identificar al usuario");
      return;
    }

    if (!propertyData?.propertyInfo?.id) {
      toast.error("Error: No hay información del predio");
      return;
    }

    try {
      setSending(true);

      // Si no hay verificationID, crear el feature y verification primero
      let currentVerificationID = verificationID;

      if (!currentVerificationID) {
        console.log("🆕 Creando Verification al enviar el primer mensaje");
        
        // Buscar o crear el feature GLOBAL_PROPERTY_CHAT
        let chatFeature = propertyData?.propertyFeatures?.find(
          (feature) => feature.featureID === "GLOBAL_PROPERTY_CHAT"
        );

        if (!chatFeature) {
          console.log("🆕 Creando feature GLOBAL_PROPERTY_CHAT");
          const featureInput = {
            propertyID: propertyData.propertyInfo.id,
            featureID: "GLOBAL_PROPERTY_CHAT",
            value: JSON.stringify({ chatInitialized: true }),
            isToBlockChain: false,
            isOnMainCard: false,
            isResult: false,
            order: 0,
          };

          const featureResp = await API.graphql(
            graphqlOperation(createPropertyFeature, { input: featureInput })
          );
          chatFeature = featureResp?.data?.createPropertyFeature;
          
          // Refrescar propertyData
          if (refreshPropertyData) {
            await refreshPropertyData();
          }
        }

        // Crear el Verification
        const verificationInput = {
          propertyFeatureID: chatFeature.id,
          userVerifiedID: user.id,
        };

        const verificationResp = await API.graphql(
          graphqlOperation(createVerification, { input: verificationInput })
        );
        const newVerification = verificationResp?.data?.createVerification;
        
        if (!newVerification) {
          throw new Error("No se pudo crear el Verification");
        }

        currentVerificationID = newVerification.id;
        setVerificationID(newVerification.id);
        
        // Actualizar usuarios disponibles
        const projectVerifiers = propertyData?.projectVerifiers || [];
        const projectPostulant = propertyData?.projectPostulant?.id;
        const allUsers = [
          ...projectVerifiers,
          ...(projectPostulant ? [projectPostulant] : []),
          user.id,
        ].filter(Boolean);
        setAvailableChatUsers([...new Set(allUsers)]);

        // Refrescar propertyData
        if (refreshPropertyData) {
          await refreshPropertyData();
        }

        console.log("✅ Verification creado:", newVerification.id);
      }

      const commentData = {
        verificationID: currentVerificationID,
        comment: newMessage.trim(),
        isCommentByVerifier: user.role === "legal" || user.role === "validator",
      };

      const propertyID = propertyData?.propertyInfo?.id;
      const propertyName = propertyData?.propertyInfo?.name || "Predio";

      // Determinar el usuario que debe recibir la notificación
      const otherUser = availableChatUsers.find((id) => id !== user.id);

      const notificationData = {
        userOriginID: user.id,
        userID: otherUser || "",
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

      await API.graphql(
        graphqlOperation(createVerificationComment, { input: commentData })
      );

      if (otherUser) {
        await API.graphql(
          graphqlOperation(createNotification, { input: notificationData })
        );
      }

      setNewMessage("");
      toast.success("Mensaje enviado");

      // Marcar que se debe hacer scroll cuando se actualicen los mensajes
      shouldScrollRef.current = true;

      // Refrescar propertyData para obtener los mensajes actualizados
      // El useEffect se ejecutará automáticamente cuando propertyData se actualice
      if (refreshPropertyData) {
        await refreshPropertyData();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error?.errors?.[0]?.message || error?.message || "Error desconocido";
      toast.error(`Error al enviar el mensaje: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const notificationsRead = async () => {
    const propertyID = propertyData?.propertyInfo?.id;
    if (!propertyID || !user?.id) return;

    try {
      // Obtener las notificaciones del usuario relacionadas con el propertyID
      const response = await API.graphql(
        graphqlOperation(listNotifications, {
          filter: {
            userID: { eq: user.id },
            resourceID: { eq: propertyID },
            isRead: { eq: false },
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

      console.log("✅ Notificaciones marcadas como leídas");
    } catch (error) {
      console.error("❌ Error marcando notificaciones como leídas:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terrasacha-primary"></div>
        </div>
      </div>
    );
  }

  // Permitir usar el chat incluso si no hay verification aún (se creará al enviar el primer mensaje)

  return (
    <div className="bg-white rounded-xl border border-terrasacha-light/20 shadow-terrasacha flex flex-col h-[600px]">
      {/* Header del chat */}
      <div className="p-4 border-b border-terrasacha-light/20 bg-terrasacha-primary/5">
        <div className="flex items-center space-x-3">
          <FaComments className="text-terrasacha-primary text-xl" />
          <div>
            <h3 className="text-lg font-bold text-terrasacha-primary font-typographica">
              Chat del Predio
            </h3>
            <p className="text-xs text-terrasacha-secondary1 font-typographica">
              {propertyData?.propertyInfo?.name || "Predio"}
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaComments className="text-6xl text-terrasacha-light mb-4" />
            <p className="text-terrasacha-secondary1 font-typographica">
              No hay mensajes aún. ¡Sé el primero en escribir!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            // Asegurar que el mensaje tenga todos los campos necesarios
            const messageWithDefaults = {
              id: message.id || `msg-${index}-${Date.now()}`,
              comment: message.comment || "",
              isCommentByVerifier: message.isCommentByVerifier || false,
              createdAt: message.createdAt || new Date().toISOString(),
              ...message,
            };

            // Determinar si es mensaje propio basándose en isCommentByVerifier y el rol del usuario
            const isOwnMessage = messageWithDefaults.isCommentByVerifier
              ? (user?.role === "legal" || user?.role === "validator")
              : !messageWithDefaults.isCommentByVerifier && (user?.role !== "legal" && user?.role !== "validator");
            const showAvatar = index === 0 || messages[index - 1]?.isCommentByVerifier !== messageWithDefaults.isCommentByVerifier;
            const showDate = index === 0 || 
              new Date(messageWithDefaults.createdAt).toDateString() !== 
              new Date(messages[index - 1]?.createdAt || 0).toDateString();

            return (
              <div key={messageWithDefaults.id}>
                {/* Mostrar fecha si es diferente al mensaje anterior */}
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-terrasacha-secondary1 bg-white px-3 py-1 rounded-full border border-terrasacha-light/20 font-typographica">
                      {new Date(messageWithDefaults.createdAt).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                )}

                <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} items-end space-x-2`}>
                  {/* Avatar */}
                  {!isOwnMessage && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-terrasacha-primary flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-white text-xs" />
                    </div>
                  )}
                  {!isOwnMessage && !showAvatar && (
                    <div className="w-8 flex-shrink-0" />
                  )}

                  <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%]`}>
                    {/* Nombre del usuario */}
                    {!isOwnMessage && showAvatar && (
                      <span className="text-xs font-semibold text-terrasacha-primary mb-1 px-1 font-typographica">
                        {messageWithDefaults.isCommentByVerifier
                          ? roleMapper[verifierRole] || "Consultor"
                          : userVerifiedName || "Usuario"}
                      </span>
                    )}

                    {/* Burbuja del mensaje */}
                    <div
                      className={`rounded-lg p-3 ${
                        isOwnMessage
                          ? "bg-terrasacha-primary text-white"
                          : "bg-white text-terrasacha-primary border border-terrasacha-light/20"
                      }`}
                    >
                      <p className="text-sm font-typographica whitespace-pre-wrap break-words">
                        {messageWithDefaults.comment}
                      </p>
                      <span className={`text-xs mt-1 block ${
                        isOwnMessage ? "text-white/70" : "text-terrasacha-secondary1"
                      } font-typographica`}>
                        {new Date(messageWithDefaults.createdAt).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para enviar mensaje */}
      <div className="p-4 border-t border-terrasacha-light/20 bg-white">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={verificationID ? "Escribe tu mensaje..." : "Escribe tu primer mensaje para iniciar el chat..."}
            rows={2}
            disabled={sending}
            className="flex-1 px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-terrasacha-primary text-white rounded-lg hover:bg-terrasacha-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-typographica"
          >
            <FaPaperPlane />
            <span>{sending ? "Enviando..." : "Enviar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

