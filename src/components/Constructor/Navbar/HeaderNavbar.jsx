import React, { Component } from 'react';
import Container from '../../ui/Container';
import s from './HeaderNavbar.module.css'; // Make sure to adjust the import based on your file structure

// Import images
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
        return (
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <Container>
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img
                                src={LOGO}
                                className="h-8"
                                alt="Your Logo"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Your Brand
                            </span>
                        </a>
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
                        <div
                            className="hidden w-full md:block md:w-auto"
                            id="navbar-default"
                        >
                            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                                        aria-current="page"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </nav>
        );
    }
}
