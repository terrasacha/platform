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
          <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <Container>
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                  <img src={LOGO} alt="Logo" className="h-8" />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                    suan
                  </span>
                </Link>
                <button
                  data-collapse-toggle="navbar-default"
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-default"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                  <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li>
                      <Link
                        to="/"
                        className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                        aria-current="page"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        About
                      </Link>
                    </li>
                    {/* Add other navigation links as needed */}
                  </ul>
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
