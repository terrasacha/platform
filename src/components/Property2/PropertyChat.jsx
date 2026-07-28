import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  FaLock,
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
  const [userVerifierID, setUserVerifierID] = useState(null);
  const [userVerifiedID, setUserVerifiedID] = useState(null);
  const messagesEndRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!propertyData?.propertyInfo?.id || !user?.id) {
      return;
    }

    try {
      setLoading(true);

      const chatFeature = propertyData?.propertyFeatures?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_CHAT"
      );

      if (!chatFeature) {
        setVerificationID(null);
        setUserVerifierID(null);
        setUserVerifiedID(null);
        setMessages([]);
        setLoading(false);
        return;
      }

      let propertyVerification = null;

      if (chatFeature?.verifications?.items?.length > 0) {
        const existingVerifications = [...chatFeature.verifications.items];
        existingVerifications.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        propertyVerification = existingVerifications[0];
      }

      if (!propertyVerification) {
        setVerificationID(null);
        setUserVerifierID(null);
        setUserVerifiedID(null);
        setMessages([]);
        setLoading(false);
        return;
      }

      setVerificationID(propertyVerification.id);
      setUserVerifiedName(propertyVerification?.userVerified?.name || "");
      setUserVerifierID(propertyVerification?.userVerifierID || null);
      setUserVerifiedID(propertyVerification?.userVerifiedID || null);

      let sortedMessages = [];

      if (propertyVerification?.verificationComments?.items?.length > 0) {
        sortedMessages = propertyVerification.verificationComments.items
          .map((comment, idx) => ({
            id:
              comment.id ||
              `comment-${propertyVerification.id}-${idx}-${comment.createdAt || Date.now()}`,
            comment: comment.comment || "",
            isCommentByVerifier: comment.isCommentByVerifier || false,
            verificationID: comment.verificationID || propertyVerification.id,
            createdAt: comment.createdAt || new Date().toISOString(),
            updatedAt: comment.updatedAt || new Date().toISOString(),
            userID: propertyVerification.userVerifiedID,
          }))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setMessages(sortedMessages);

      const projectVerifiers = propertyData?.projectVerifiers || [];
      const projectPostulant = propertyData?.projectPostulant?.id;
      const allUsers = [
        ...projectVerifiers,
        ...(projectPostulant ? [projectPostulant] : []),
        propertyVerification?.userVerifierID,
        propertyVerification.userVerifiedID,
      ].filter(Boolean);

      setAvailableChatUsers([...new Set(allUsers)]);
      setVerifierRole(propertyVerification?.userVerifier?.role);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error al cargar los mensajes");
    } finally {
      setLoading(false);
    }
  }, [propertyData, user?.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const chatPermission = useMemo(() => {
    if (!user?.id) {
      return {
        canSend: false,
        reason: "No se pudo identificar al usuario.",
      };
    }

    if (!verificationID) {
      if (user.role === "constructor") {
        return { canSend: true, reason: null };
      }

      if (user.role === "validator") {
        return {
          canSend: false,
          reason:
            "Tu perfil no tiene permisos para enviar mensajes en este chat. Solo el propietario puede iniciar la conversación.",
        };
      }

      return {
        canSend: false,
        reason:
          "Tu perfil no tiene permisos para enviar mensajes en este chat.",
      };
    }

    const ownerId = userVerifiedID || propertyData?.projectPostulant?.id;
    const isOwnerParticipant =
      user.role === "constructor" && user.id === ownerId;
    const isVerifierParticipant =
      (user.role === "validator" || user.role === "legal") &&
      user.id === userVerifierID;

    if (isOwnerParticipant || isVerifierParticipant) {
      return { canSend: true, reason: null };
    }

    if (user.role === "validator" || user.role === "legal") {
      return {
        canSend: false,
        reason:
          "Tu perfil no tiene permisos para enviar mensajes en este chat. Debes estar asignado al predio para participar.",
      };
    }

    return {
      canSend: false,
      reason:
        "Tu perfil no tiene permisos para enviar mensajes en este chat.",
    };
  }, [
    user?.id,
    user?.role,
    verificationID,
    userVerifierID,
    userVerifiedID,
    propertyData?.projectPostulant?.id,
  ]);

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

    if (!chatPermission.canSend) {
      toast.info(
        chatPermission.reason ||
          "Tu perfil no tiene permisos para enviar mensajes en este chat."
      );
      return;
    }

    if (!user?.id) {
      toast.error("Error: No se pudo identificar al usuario");
      return;
    }

    if (!propertyData?.propertyInfo?.id) {
      toast.error("Error: No hay información del predio");
      return;
    }

    const messageText = newMessage.trim();

    try {
      setSending(true);

      let currentVerificationID = verificationID;

      if (!currentVerificationID) {
        let chatFeature = propertyData?.propertyFeatures?.find(
          (feature) => feature.featureID === "GLOBAL_PROPERTY_CHAT"
        );

        if (!chatFeature) {
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

          if (refreshPropertyData) {
            await refreshPropertyData();
          }
        }

        const ownerId = propertyData?.projectPostulant?.id || user.id;
        const verificationInput = {
          propertyFeatureID: chatFeature.id,
          userVerifiedID: ownerId,
        };

        const verificationResp = await API.graphql(
          graphqlOperation(createVerification, { input: verificationInput })
        );
        const newVerification = verificationResp?.data?.createVerification;

        if (!newVerification?.id) {
          throw new Error("No se pudo iniciar el chat del predio");
        }

        currentVerificationID = newVerification.id;
        setVerificationID(newVerification.id);
        setUserVerifiedID(ownerId);

        const projectVerifiers = propertyData?.projectVerifiers || [];
        const allUsers = [
          ...projectVerifiers,
          ownerId,
          user.id,
        ].filter(Boolean);
        setAvailableChatUsers([...new Set(allUsers)]);

        if (refreshPropertyData) {
          await refreshPropertyData();
        }
      }

      const commentData = {
        verificationID: currentVerificationID,
        comment: messageText,
        isCommentByVerifier: user.role === "legal" || user.role === "validator",
      };

      const propertyID = propertyData?.propertyInfo?.id;
      const propertyName = propertyData?.propertyInfo?.name || "Predio";
      const otherUser = availableChatUsers.find((id) => id !== user.id);

      const commentResp = await API.graphql(
        graphqlOperation(createVerificationComment, { input: commentData })
      );
      const createdComment = commentResp?.data?.createVerificationComment;

      if (!createdComment?.id) {
        throw new Error("No se pudo guardar el mensaje");
      }

      if (otherUser) {
        const notificationData = {
          userOriginID: user.id,
          userID: otherUser,
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
          graphqlOperation(createNotification, { input: notificationData })
        );
      }

      const persistedMessage = {
        id: createdComment.id,
        comment: messageText,
        isCommentByVerifier: commentData.isCommentByVerifier,
        verificationID: currentVerificationID,
        createdAt: createdComment.createdAt || new Date().toISOString(),
        updatedAt: createdComment.updatedAt || new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, persistedMessage]);
      setNewMessage("");
      shouldScrollRef.current = true;
      toast.success("Mensaje enviado");

      if (refreshPropertyData) {
        await refreshPropertyData();
        await loadMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error?.errors?.[0]?.message || error?.message || "Error desconocido";
      const normalizedError = errorMessage.toLowerCase();

      if (
        normalizedError.includes("unauthorized") ||
        normalizedError.includes("not authorized") ||
        normalizedError.includes("permission") ||
        normalizedError.includes("forbidden")
      ) {
        toast.error(
          "No tienes permisos para enviar mensajes en este chat con tu rol actual."
        );
        return;
      }

      toast.error(`No se pudo enviar el mensaje: ${errorMessage}`);
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

  const emptyChatMessage = chatPermission.canSend
    ? "No hay mensajes aún. ¡Sé el primero en escribir!"
    : user?.role === "validator"
    ? "No hay mensajes aún. Podrás ver la conversación cuando participes en el chat asignado a este predio."
    : "No hay mensajes aún en este chat.";

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

      {!chatPermission.canSend && (
        <div
          className="mx-4 mt-4 bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-3"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <FaLock
              className="text-[#6e6c35] mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-sm text-[#6e6c35] font-typographica mb-0 opacity-90">
              {chatPermission.reason}
            </p>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <FaComments className="text-6xl text-terrasacha-light mb-4" />
            <p className="text-terrasacha-secondary1 font-typographica">
              {emptyChatMessage}
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
              if (!chatPermission.canSend) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              chatPermission.canSend
                ? verificationID
                  ? "Escribe tu mensaje..."
                  : "Escribe tu primer mensaje para iniciar el chat..."
                : "Tu perfil no tiene permisos para enviar mensajes en este chat."
            }
            rows={2}
            disabled={sending || !chatPermission.canSend}
            aria-disabled={!chatPermission.canSend}
            className="flex-1 px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !chatPermission.canSend}
            title={
              chatPermission.canSend
                ? "Enviar mensaje"
                : chatPermission.reason ||
                  "Tu perfil no tiene permisos para enviar mensajes en este chat."
            }
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

