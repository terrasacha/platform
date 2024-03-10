import React, { Component } from 'react';
import LOGO from '../../common/_images/suan_logo.png';

export default class HeaderNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeHeaderNavBarRequest = this.props.changeHeaderNavBarRequest.bind(this);
    this.handleSignOut = this.props.handleSignOut.bind(this);
    this.handleChangeObjectElement = this.handleChangeObjectElement.bind(this);
  }

  async handleChangeObjectElement() {
    console.log('handleChangeObjectElement: ');
    this.props.handleSignOut();
  }

  handleOnChangeInputForm = async (event) => {
    if (event.target.name === 'desiredSubscriptionTopic') {
      await this.setState({ desiredSubscriptionTopic: event.target.value });
    }
    if (event.target.name === 'desiredPublishTopic') {
      await this.setState({ desiredPublishTopic: event.target.value });
    }
  };

  render() {
    const { isActualUserLogged } = this.props;
    const role = localStorage.getItem('role');

    const renderNavBar = () => {
      if (isActualUserLogged) {
        return (
          <nav className="bg-white fixed top-0 w-full">
            <div className="container mx-auto flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img
                  src={LOGO}
                  alt="ATP"
                  className="w-auto h-10"
                />
              </a>
              <button
                className="lg:hidden focus:outline-none"
                onClick={() => console.log('Toggle navbar')}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
              <div className="hidden lg:flex items-center space-x-4">
                <a href="#products" onClick={(e) => this.changeHeaderNavBarRequest('products', e)}>
                  Proyectos
                </a>
                <a href="#documents" onClick={(e) => this.changeHeaderNavBarRequest('documents', e)}>
                  Documentos
                </a>
                <a href="#formulas" onClick={(e) => this.changeHeaderNavBarRequest('formulas', e)}>
                  Fórmulas
                </a>
                <a href="#results" onClick={(e) => this.changeHeaderNavBarRequest('results', e)}>
                  Resultados
                </a>
                <a href="#categorys" onClick={(e) => this.changeHeaderNavBarRequest('categorys', e)}>
                  Categorías
                </a>
                <a href="#items" onClick={(e) => this.changeHeaderNavBarRequest('items', e)}>
                  Items de proyectos
                </a>
                <a href="#features" onClick={(e) => this.changeHeaderNavBarRequest('features', e)}>
                  Features
                </a>
                <a href="#uom" onClick={(e) => this.changeHeaderNavBarRequest('uom', e)}>
                  UOM
                </a>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <span className="font-semibold text-red-500">{role ? role : ''}</span>
                <a href="#assign_pf" onClick={(e) => this.changeHeaderNavBarRequest('assign_pf', e)}>
                  Asignar Validadores
                </a>
                <a href="#validators" onClick={(e) => this.changeHeaderNavBarRequest('validators', e)}>
                  Validadores
                </a>
                <button onClick={(e) => this.handleChangeObjectElement()} className="text-red-500">
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        );
      }
    };

    return <>{renderNavBar()}</>;
  }
}
