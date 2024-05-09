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
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-0 text-lg font-bold">{title}</p>
              <p className="mb-0 font-light">{subtitle}</p>
            </div>
            <div>{tooltip}</div>
          </div>
        </header>
        {sep && <hr className="my-0 border-t-1" />}
      </>
    );
  }
}

class CardBody extends Component {
  render() {
    const className = this.props.className || "";
    return (
      <section className={className + " p-4 flex-grow"}>
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
        {sep && <hr className="my-0" />}
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
