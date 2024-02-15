import React, { Component } from "react";

import Form from "../ui/Form";
import FloatingLabel from "../ui/FloatingLabel";
import Button from "../ui/Button";
import { SaveDiskIcon } from "./icons/SaveDiskIcon";
import GoogleMapReact from "google-map-react";
import { MapPinIcon } from "./icons/MapPinIcon";

export default class FormGroup extends Component {
  // toDo Manejar switch, select inputs
  // toDo Implementar OnClick, OnChange en todos los tipos de componentes
  render() {
    const type = this.props.type || "block";
    const inputSize = this.props.inputSize || "sm";
    const label = this.props.label || "";
    const hint = this.props.hint || "";
    const required = this.props.required || "";
    const inputType = this.props.inputType || "text";
    const inputValue = this.props.inputValue || "";
    const inputError = this.props.inputError || "";
    const inputName = this.props.inputName || "";
    const inputPlaceholder = this.props.inputPlaceholder || "";
    const optionList = this.props.optionList || [];
    const optionCheckedList = this.props.optionCheckedList || [];
    const disabled = this.props.disabled || false;
    const saveBtnVisible = this.props.saveBtnVisible === false ? false : true; // Existe un problema al usar || si la condicion que se quiere por defecto es true. Al enviar un parametro false lo ignora y setea true.
    const saveBtnDisabled = this.props.saveBtnDisabled || false;
    const onClickSaveBtn = this.props.onClickSaveBtn;
    const onChangeInputValue = this.props.onChangeInputValue;
    const onMapClick = this.props.onMapClick;
    const checked = this.props.checked;
    const markers = this.props.markers;

    const className = this.props.className || "";

    function handleInputRenderByInputType(inputType) {
      if (
        inputType === "text" ||
        inputType === "number" ||
        inputType === "email" ||
        inputType === "password"
      ) {
        return (
          <input
            disabled={disabled}
            className={`form-control ${inputSize}`}
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
          <textarea
            disabled={disabled}
            className={`form-control ${inputSize}`}
            name={inputName}
            rows={4}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={onChangeInputValue}
          />
        );
      }
      if (inputType === "select") {
        return (
          <select
            disabled={disabled}
            className={`form-select ${inputSize}`}
            name={inputName}
            value={inputValue}
            onChange={onChangeInputValue}
          >
            <option disabled value=""></option>
            {optionList.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
        );
      }
      if (inputType === "switch") {
        return (
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={inputName}
              checked={checked}
              onChange={onChangeInputValue}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor={inputName}>
              {label}
            </label>
          </div>
        );
      }
      if (inputType === "geopoint") {
        const defaultData = { coords: { lat: 4.73, lng: -74.03 }, zoom: 6 };
        // const Marker = ({ text }) => (
        //   <div
        //     style={{ width: "20px", height: "20px", color: "red" }}
        //   >
        //     <MapPinIcon />
        //   </div>
        // );

        return (
          <div className="border p-2">
            <div className="mb-2" style={{ height: "570px", width: "100%" }}>
              <GoogleMapReact
                // key={new Date().getTime()}
                bootstrapURLKeys={{
                  key: "AIzaSyCzXTla3o3V7o72HS_mvJfpVaIcglon38U",
                }}
                defaultCenter={defaultData.coords}
                defaultZoom={defaultData.zoom}
                onClick={onMapClick}
              >
                {/* {markers.map((marker, index) => {
                  return (
                    <Marker
                      key={index}
                      lat={marker.lat}
                      lng={marker.lng}
                      text={"Hola"}
                    ></Marker>
                  );
                })} */}
              </GoogleMapReact>
            </div>
            {markers.length > 0 && (
              <>
                <div>
                  <label className="mb-0">Latitud</label>
                  <input
                    disabled={true}
                    className="form-control form-control-sm"
                    type="number"
                    placeholder="Latitud"
                    value={markers[0].lat}
                  />
                </div>
                <div>
                  <label className="mb-0">Longitud</label>
                  <input
                    disabled={true}
                    className="form-control form-control-sm"
                    type="number"
                    placeholder="Longitud"
                    value={markers[0].lng}
                  />
                </div>
              </>
            )}
          </div>
        );
      }
      if (inputType === "radio" || inputType === "checkbox") {
        return (
          <>
            {optionList.map(({ label, value }) => (
              <div key={`opt-${label}`}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type={inputType}
                    name={inputName}
                    checked={optionCheckedList.includes(value)}
                    onChange={onChangeInputValue}
                    value={value}
                  />
                  <label className="form-check-label">{label}</label>
                </div>
              </div>
            ))}
          </>
        );
      }
      if (inputType === "file") {
        return (
          <input
            type={inputType}
            className={`form-control ${inputSize}`}
            name={inputName}
            onChange={onChangeInputValue}
          />
        );
      }
    }
  
    if (type === "block") {
      return (
        <div className={`${className} mb-3`}>
          {inputType !== "switch" && (
            <label className="mb-0">
              {label}
              {required && <span className="fs-6 text-danger">*</span>}
            </label>
          )}
          <p className="fw-light fst-italic mb-0">{hint}</p>
          {handleInputRenderByInputType(inputType)}
          <p className="fw-light fst-italic mb-0 text-danger">{inputError}</p>
        </div>
      );
    }
    if (type === "floating") {
      return (
        <div className={`${className} mb-3 floating-label`}>
          <label>{label}</label>
          {handleInputRenderByInputType(inputType)}
        </div>
      );
    }
    if (type === "flex") {
      return (
        <div className={`${className} mb-3`}>
          <div className="row align-items-center">
            {inputType !== "switch" && (
              <label className="col-5">{label}</label>
            )}
            <div className="col">{handleInputRenderByInputType(inputType)}</div>
            {saveBtnVisible && (
              <div className="col-auto">
                <button
                  disabled={saveBtnDisabled}
                  className="btn btn-success"
                  onClick={onClickSaveBtn}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}
