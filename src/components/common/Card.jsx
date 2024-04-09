import React, { Component } from "react";

class CardHeader extends Component {
  render() {
    const sep = this.props.sep || false;
    const title = this.props.title || "";
    const subtitle = this.props.subtitle || "";
    const tooltip = this.props.tooltip || "";
    return (
      <>
        <header className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0 fs-5 fw-bold">{title}</p>
              <p className="mb-0 fw-light">{subtitle}</p>
            </div>
            <div>{tooltip}</div>
          </div>
        </header>
        {sep && <hr className="m-0 border-1" />}
      </>
    );
  }
}

class CardBody extends Component {
  render() {
    const className = this.props.className || "";
    return (
      <section className={className + " p-4 flex-grow-1"}>
        {this.props.children}
      </section>
    );
  }
}

class CardFooter extends Component {
  render() {
    const sep = this.props.sep || false;
    return (
      <>
        {sep && <hr className="m-0" />}
        <footer className="py-3 px-4">{this.props.children}</footer>
      </>
    );
  }
}

export default class Card extends Component {
  static Header = CardHeader;
  static Body = CardBody;
  static Footer = CardFooter;

  render() {
    const className = this.props.className || "";
    return (
      <div className={className + " border rounded shadow"}>
        {this.props.children}
      </div>
    );
  }
}
