import React from "react";

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
    <Card className={className}>
      <Card.Header title="Comentarios" sep={true} />
      <Card.Body>
        {messages.map((message) => {
          return (
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
          );
        })}
        {(isPostulant || isFileVerifier) && !isDocApproved && (
          <div className="d-flex">
            <input
              type="text"
              placeholder="Escribe tu comentario aquí"
              className="border-[1px] w-full p-2 rounded-md"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            <button
              className="px-2 py-1 rounded-md bg-slate-900 text-white"
              onClick={handleSendMessageButtonClick}
            >
              Enviar
            </button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
