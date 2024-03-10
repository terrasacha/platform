import React, { Component } from 'react';
import Container from './components/ui/Container';
import Nav from './components/ui/Nav';
import Navbar from './components/ui/Navbar';
import { ListTask } from 'react-bootstrap-icons';
import LOGO from '../../common/_images/suan_logo.png';

export default class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChangeNavBar = this.handleChangeNavBar.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async handleChangeNavBar(pRequest) {
    console.log('handleChangeNavBar: ', pRequest);
    this.props.changeHeaderNavBarRequest(pRequest);
  }

  async handleSignOut() {
    this.props.handleSignOut();
  }

  render() {
    let role = localStorage.getItem('role');
    return (
      <nav className="bg-white fixed top-0 w-full">
        <Container>
          <div className="flex items-center justify-between">
            <a href="/">
              <img
                src={LOGO}
                width="80"
                height="auto"
                className="d-inline-block align-top"
                alt="BBT"
              />
            </a>
            <Nav>
              <a
                href="/"
                onClick={(e) => this.handleChangeNavBar('investor_documents', e)}
                className="text-gray-800 hover:text-gray-600 mr-4"
              >
                Documents
              </a>
              <a
                href="/"
                onClick={(e) => this.handleChangeNavBar('products_buyed', e)}
                className="text-gray-800 hover:text-gray-600"
              >
                Products
              </a>
            </Nav>
            <Nav>
              <span className="font-bold text-red-500">{role ? role : ''}</span>
              <button
                onClick={(e) => this.handleSignOut()}
                className="ml-4 py-2 px-4 rounded bg-red-500 text-white"
              >
                Sign Out
              </button>
            </Nav>
          </div>
        </Container>
      </nav>
    );
  }
}
