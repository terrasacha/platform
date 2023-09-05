import React, { Component } from "react";

import Form from "react-bootstrap/Form";

export default class FormGroup extends Component {
  // toDo Manejar switch, select inputs
  // toDo Implementar Hints
  // toDo Implementar *
  render() {
    const inputSize = this.props.inputSize || "sm";
    const label = this.props.label || "";
    const inputType = this.props.inputType || "text";
    const inputValue = this.props.inputValue || "";
    const inputPlaceholder = this.props.inputPlaceholder || "";
    const optionList = this.props.optionList || [];
    const optionCheckedList = this.props.optionCheckedList || [];
    const disabled = this.props.disabled || false;

    const className = this.props.className || "";

    function handleInputRenderByInputType(inputType) {
      if (
        inputType === "text" ||
        inputType === "email" ||
        inputType === "password"
      ) {
        return (
          <Form.Control
            disabled={disabled}
            size={inputSize}
            type={inputType}
            placeholder={inputPlaceholder}
            value={inputValue}
          />
        );
      }
      if (inputType === "textarea") {
        return (
          <Form.Control
            disabled={disabled}
            size={inputSize}
            as={inputType}
            rows={4}
            placeholder={inputPlaceholder}
            value={inputValue}
          />
        );
      }
      if (inputType === "radio" || inputType === "checkbox") {
        return (
          <>
            {optionList.map((option) => (
              <div key={`opt-${option}`}>
                <Form.Check
                  disabled={disabled}
                  checked={optionCheckedList.includes(option)}
                  type={inputType}
                  label={option}
                  id={`opt-${option}`}
                />
              </div>
            ))}
          </>
        );
      }
    }

    return (
      <Form.Group className={className + " mb-3"}>
        <Form.Label>{label}</Form.Label>
        {handleInputRenderByInputType(inputType)}
      </Form.Group>
    );
  }
}
