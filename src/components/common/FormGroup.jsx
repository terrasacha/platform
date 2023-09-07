import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { SaveDiskIcon } from "./icons/SaveDiskIcon";

export default class FormGroup extends Component {
  // toDo Manejar switch, select inputs
  // toDo Implementar OnClick, OnChange en todos los tipos de componentes
  // toDo Implementar Hints
  // toDo Implementar *
  render() {
    const type = this.props.type || "block";
    const inputSize = this.props.inputSize || "sm";
    const label = this.props.label || "";
    const inputType = this.props.inputType || "text";
    const inputValue = this.props.inputValue || "";
    const inputName = this.props.inputName || "";
    const inputPlaceholder = this.props.inputPlaceholder || "";
    const optionList = this.props.optionList || [];
    const optionCheckedList = this.props.optionCheckedList || [];
    const disabled = this.props.disabled || false;
    const saveBtnDisabled = this.props.saveBtnDisabled || false;
    const onClickSaveBtn = this.props.onClickSaveBtn;
    const onChangeInputValue = this.props.onChangeInputValue;
    const checked = this.props.checked;

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
            name={inputName}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={onChangeInputValue}
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
      if (inputType === "switch") {
        return (
          <Form.Check
            disabled={disabled}
            checked={checked}
            type={inputType}
            label={label}
            onChange={onChangeInputValue}
            id={`opt-${label}`}
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

    if (type === "block") {
      return (
        <Form.Group className={className + " mb-3"}>
        {
          inputType !== "switch" && (
            <Form.Label>
              {label}
            </Form.Label>
          )
        }
          {handleInputRenderByInputType(inputType)}
        </Form.Group>
      );
    }
    if (type === "flex") {
      return (
        <Form.Group className={className + " mb-3"}>
          <div className="row align-items-center">
            {
              inputType !== "switch" && (
                <Form.Label column sm="5">
                  {label}
                </Form.Label>
              )
            }
            <div className="col">{handleInputRenderByInputType(inputType)}</div>
            <div className="col-auto">
              <Button disabled={saveBtnDisabled} variant="success" onClick={onClickSaveBtn}>
                <SaveDiskIcon />
              </Button>
            </div>
          </div>
        </Form.Group>
      );
    }
  }
}
