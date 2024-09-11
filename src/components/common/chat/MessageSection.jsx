import React, { Component } from "react";

// toDo calcular el "days ago" revisar en nana en el componente de chat creado (funcion similar implementada)
export default class MessageSection extends Component {
  render() {
    const className = this.props.className || "";
    const sender = this.props.sender || "";
    const message = this.props.message || "";
    const createdAt = this.props.createdAt || "";
    const elapsedTime = this.props.elapsedTime || "";
    const icon = this.props.icon || "";
    return (
      <section className={className}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <div className="d-flex align-items-center border rounded p-3 me-3">
              {icon}
            </div>
            <div className="d-block mw-100">
              <div className="d-flex">
                <p className="fs-6 mb-0 fw-bold me-2">{sender}</p>
                <p className="fs-6 mb-0 fw-light">| {elapsedTime}</p>
              </div>
              <p className="fs-6 mb-0 text-break">{message}</p>
            </div>
          </div>
          <div className="d-flex ms-3" style={{ minWidth: "90px" }}>
            <p className="fs-6 mb-0">{createdAt}</p>
          </div>
        </div>
        <hr />
      </section>
    );
  }
}
