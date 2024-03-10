import React from "react";

import Form from "../../../../ui/Form";
import Button from "../../../../ui/Button";

import Card from "../../../../common/Card";
import MessageSection from "../../../../common/chat/MessageSection";
import { UserSearchIcon } from "../../../../common/icons/UserSearchIcon";
import { UserSquareIcon } from "../../../../common/icons/UserSquareIcon";

export default function MessagesHistoryCard(props) {
  const {
    className,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessageButtonClick,
    isPostulant,
    isFileVerifier,
    isDocApproved,
  } = props;

  return (
    <div className={className}>
  <div className="border-b mb-4">
    <h5 className="text-xl font-semibold">Comentarios</h5>
  </div>
  <div className="space-y-4">
    {messages.map((message) => (
      <MessageSection
        key={message.id}
        icon={
          message.isCommentByVerifier ? (
            <UserSearchIcon />
          ) : (
            <UserSquareIcon />
          )
        }
        sender={message.userName}
        message={message.comment}
        createdAt={message.createdAt}
        elapsedTime={message.elapsedTime}
      />
    ))}
    {(isPostulant || isFileVerifier) && !isDocApproved && (
      <div className="flex">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Escribe tu comentario aquí"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button
          className="p-2 bg-dark text-white ms-2"
          onClick={handleSendMessageButtonClick}
        >
          Enviar
        </button>
      </div>
    )}
  </div>
</div>
  );
}
