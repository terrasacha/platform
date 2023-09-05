import React, { Component } from "react";

export default class MiniInfoCard extends Component {
  render() {
    const className = this.props.className || "";
    const label = this.props.label || "";
    const value = this.props.value || "";
    return (
      <div className={className + " border p-2"} style={{ width: "150px" }}>
        <p className="fs-6 mb-0 fw-bold">{value}</p>
        <p className="fs-6 mb-0 fw-light">{label}</p>
      </div>
    );
  }
}
