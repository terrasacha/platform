import React, { Component } from 'react';
import Container from '../../ui/Container';
import { Link } from 'react-router-dom';

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
    let { isActualUserLogged } = this.props;
    let role = localStorage.getItem('role');

    const renderNavBar = () => {
      if (isActualUserLogged) {
        return (
          <nav className="bg-white fixed top-0 w-full">
            <Container>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <button
                    className="text-2xl font-bold text-gray-800"
                    onClick={(e) => this.changeHeaderNavBarRequest('home', e)}
                  >
                    <img src={LOGO} alt="Logo" className="h-10" />
                  </button>

                  <div className="hidden md:flex space-x-4">
                    <Link to="/products" onClick={(e) => this.changeHeaderNavBarRequest('products', e)}>
                      <span>Proyectos</span>
                    </Link>
                    <Link to="/documents" onClick={(e) => this.changeHeaderNavBarRequest('documents', e)}>
                      <span>Documentos</span>
                    </Link>
                    <Link to="/formulas" onClick={(e) => this.changeHeaderNavBarRequest('formulas', e)}>
                      <span>Fórmulas</span>
                    </Link>
                    <Link to="/results" onClick={(e) => this.changeHeaderNavBarRequest('results', e)}>
                      <span>Resultados</span>
                    </Link>
                    <Link to="/categorys" onClick={(e) => this.changeHeaderNavBarRequest('categorys', e)}>
                      <span>Categorías</span>
                    </Link>
                    <Link to="/items" onClick={(e) => this.changeHeaderNavBarRequest('items', e)}>
                      <span>Items de proyectos</span>
                    </Link>
                    <Link to="/features" onClick={(e) => this.changeHeaderNavBarRequest('features', e)}>
                      <span>Features</span>
                    </Link>
                    <Link to="/uom" onClick={(e) => this.changeHeaderNavBarRequest('uom', e)}>
                      <span>UOM</span>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-800">{role ? role : ''}</span>
                  <Link to="/new_project">
                    <span>Crear proyecto</span>
                  </Link>
                  <Link to="/assign_pf" onClick={(e) => this.changeHeaderNavBarRequest('assign_pf', e)}>
                    <span>Asignar Validadores</span>
                  </Link>
                  <Link to="/validators" onClick={(e) => this.changeHeaderNavBarRequest('validators', e)}>
                    <span>Validadores</span>
                  </Link>
                  <button onClick={(e) => this.handleChangeObjectElement()}>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </Container>
          </nav>
        );
      }
    };

    return <>{renderNavBar()}</>;
  }
}
