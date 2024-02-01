import React from "react";

import Form from "../../ui/Form";
import Button from "../../ui/Button";

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
            <Form.Control
              size="sm"
              type="text"
              placeholder="Escribe tu comentario aquí"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            <Button
              variant="dark"
              className="ms-2"
              onClick={handleSendMessageButtonClick}
            >
              Enviar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
