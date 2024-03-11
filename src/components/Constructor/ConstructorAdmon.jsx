import React, { Component } from "react";
// Bootstrap
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Form from '../ui/Form';
import Modal from '../ui/Modal';
import Row from '../ui/Row';

import InputGroup from "../ui/InputGroup";
// Auth css custom
// Routing
// import { useHistory } from 'react-router-dom'
// GraphQL
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  createUser,
  createWallet,
  deleteWallet,
  updateUser,
} from "../../graphql/mutations";
import { getUser } from "../../graphql/queries";
// Components
import wallet from "./assets/crypto-digital-wallet-gID_4.jpg";
import profile from "./assets/PngItem_4042710.png";
import Documents from "./Documents/Documents";
import ProductsList from "./ProductsList/ProductsList";
import s from "./ConstructorAdmon.module.css";
import HeaderNavbar from "./Navbar/HeaderNavbar";
import ProductsBuyed from "./ProductsBuyed/ProductsBuyed";
import NewProduct from "./NewProduct/NewProduct";
import DocumentStatus from "./Documents/DocumentStatus";
import NewProject from "./NewProject/NewProject";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";

class ConstructorAdmon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      walletAddress: "",
      editWallet: false,
      isShowDocuments: false,
      isShowProductsBuyed: false,
      isShowProductsList: true,
      uploadNewProduct: false, //false
      isShowInvestorProfile: false, //true
      showModalDocument: false,
      isRenderProfile: false,
      isNewUser: false,
    };
    this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this);
    this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this);
    this.handleRenderCompleteOrUpdateProfile =
      this.handleRenderCompleteOrUpdateProfile.bind(this);
    this.handleHideModalDocument = this.handleHideModalDocument.bind(this);
    this.handleCUUser = this.handleCUUser.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async componentDidMount() {
    console.log("componentDidMount");
    const actualUser = await Auth.currentAuthenticatedUser();
    let userResult = await API.graphql({
      query: getUser,
      variables: { id: actualUser.attributes.sub },
    });
    this.loadUserInfo(userResult);
  }
  loadUserInfo(userResult) {
    this.setState({ user: userResult.data.getUser });
    if (userResult.data.getUser.wallets.items.length > 0) {
      this.setState({
        walletAddress: userResult.data.getUser.wallets.items[0].id,
      });
    }
  }
  async loadActualLoggedUser(actualUser) {
    let tempUser = this.state.user;
    if (actualUser !== undefined) {
      // Setting ID user from register cognito User
      const filterByUserID = {
        id: actualUser.attributes.sub,
      };
      tempUser.id = actualUser.attributes.sub;
      this.setState({ user: tempUser });

      const result = await API.graphql(
        graphqlOperation(getUser, filterByUserID)
      );
      if (result.data.getUser === null) {
        // The user doesn't exists
        await this.setState({
          isRenderProfile: true,
          isNewUser: true,
          showModalDocument: true,
        });
      } else {
        if (
          result.data.getUser.isProfileUpdated === null ||
          !result.data.getUser.isProfileUpdated
        ) {
          // The user exists but the profile is not completed
          await this.setState({
            isRenderProfile: true,
            isNewUser: false,
            showModalDocument: true,
          });
        } else {
          // The user exists and the profile is complete
          await this.setState({
            user: result.data.getUser,
            isRenderProfile: false,
            isShowProductsList: true,
            isShowDocuments: false,
            isNewUser: false,
          });
          // await this.props.setUserGraphQLUser(result.data.getUser)
        }
      }
    }
  }

  async changeHeaderNavBarRequest(pRequest) {
    console.log("changeHeaderNavBarRequest: ", pRequest);

    if (pRequest === "perfil") {
      this.setState({
        isShowDocuments: false,
        isShowProductsBuyed: false,
        isShowInvestorProfile: false,
        isRenderProfile: true,
        uploadNewProduct: false,
        isShowProductsList: false,
      });
    }

    if (pRequest === "investor_documents") {
      this.setState({
        isShowDocuments: true,
        isShowProductsBuyed: false,
        isShowInvestorProfile: false,
        isRenderProfile: false,
        uploadNewProduct: false,
        isNewUser: false,
        isShowProductsList: false,
      });
    }
    if (pRequest === "products_buyed") {
      this.setState({
        isShowDocuments: false,
        isShowProductsBuyed: true,
        isShowInvestorProfile: false,
        isRenderProfile: false,
        uploadNewProduct: false,
        isNewUser: false,
        isShowProductsList: false,
      });
    }
    if (pRequest === "upload_product") {
      this.setState({
        isShowDocuments: false,
        isShowProductsBuyed: false,
        isShowInvestorProfile: false,
        isRenderProfile: false,
        uploadNewProduct: true,
        isNewUser: false,
        isShowProductsList: false,
      });
    }
    if (pRequest === "investor_products") {
      this.setState({
        isShowDocuments: false,
        isShowProductsBuyed: false,
        isShowInvestorProfile: false,
        isRenderProfile: false,
        uploadNewProduct: false,
        isNewUser: false,
        isShowProductsList: true,
      });
    }
  }

  async setUserGraphQLUser(pUser) {
    await this.setState({ user: pUser });
  }

  async handleRenderCompleteOrUpdateProfile() {
    this.setState({ isRenderProfile: !this.state.isRenderProfile });
  }

  async handleOnChangeInputForm(event) {
    if (event.target.name === "user.name") {
      let tempUser = this.state.user;
      tempUser.name = event.target.value.toUpperCase();
      await this.setState({ user: tempUser });
    }
    if (event.target.name === "user.walletID") {
      let tempUser = this.state.user;
      tempUser.walletID = event.target.value;
      await this.setState({ user: tempUser });
    }
    if (event.target.name === "user.walletName") {
      let tempUser = this.state.user;
      tempUser.walletName = event.target.value;
      await this.setState({ user: tempUser });
    }
    // if (event.target.name === 'user.cellphone') {
    //     let tempUser = this.state.user
    //     tempUser.cellphone = event.target.value
    //     await this.setState({user: tempUser})
    // }
  }

  async handleCUUser() {
    let tempUser = this.state.user;
    tempUser.isProfileUpdated = true;

    if (this.state.isNewUser) {
      const userPayload = {
        id: tempUser.id,
        name: tempUser.name,
        isProfileUpdated: true,
        role: "investor",
      };
      await API.graphql(graphqlOperation(createUser, { input: userPayload }));
    } else {
      const userPayload = {
        id: tempUser.id,
        name: tempUser.name,
        isProfileUpdated: true,
      };
      tempUser.dateOfBirth = "2000-10-01";
      await API.graphql(graphqlOperation(updateUser, { input: userPayload }));
    }
    // Creating Wallets
    const walletPayload = {
      id: tempUser.walletID,
      name: tempUser.walletName,
      userID: tempUser.id,
      status: "new",
    };
    await API.graphql(graphqlOperation(createWallet, { input: walletPayload }));
    this.setState({ isRenderProfile: false });
  }
  handleHideModalDocument() {
    this.setState({ showModalDocument: !this.state.showModalDocument });
  }

  async handleSignOut() {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      this.setState({
        user: {
          id: "",
          name: "",
          isProfileUpdated: false,
          walletID: "",
          walletName: "",
        },
        isRenderProfile: false,
      });
      window.location.href = "/";
      // TODO: Check the option with router
      // const history = new useHistory()
      // history.push('/investor_admon')
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  editUserWallet(e) {
    if (e.target.name === "walletAddress") {
      this.setState({ walletAddress: e.target.value });
    }
  }
  async updateUserWallet(walletID) {
    await API.graphql(
      graphqlOperation(deleteWallet, { input: { id: walletID } })
    );
    let info = {
      id: this.state.walletAddress,
      name: this.state.walletAddress,
      status: "new",
      isSelected: true,
      userID: this.state.user.id,
    };
    await API.graphql(graphqlOperation(createWallet, { input: info }));
    let tempUser = this.state.user;
    tempUser.wallets.items[0].id = this.state.walletAddress;
    this.setState({ editWallet: true, user: tempUser });

    setTimeout(() => {
      this.setState({ editWallet: false });
    }, 2000);
  }
  render() {
    let {
      isShowDocuments,
      user,
      isRenderProfile,
      isShowProductsBuyed,
      uploadNewProduct,
      isShowProductsList,
    } = this.state;
    const renderUserWallets = (user) => {
      if (user.wallets !== undefined && user.wallets.items !== undefined) {
        if (user.wallets.items.length > 0) {
          return (
            <InputGroup className="mb-3">
              <Form.Control
                value={this.state.walletAddress}
                placeholder="Paste your address"
                name="walletAddress"
                aria-describedby="basic-addon2"
                onChange={(e) => this.editUserWallet(e)}
              />
              <button
                variant="outline-success"
                id="button-addon2"
                onClick={(e) => this.updateUserWallet(user.wallets.items[0].id)}
              >
                {this.state.editWallet ? "Done" : "Edit"}
              </button>
            </InputGroup>
          );
        }
      }
    };
    {
      /* <>
{user.wallets.items.map(wallet => (
                <div key={wallet.id}>
                    {wallet.id}
                </div>
            ))}
        </> */
    }

    const renderOrders = () => {
      if (isShowDocuments) {
        return <DocumentStatus />;
      }
    };
    const renderProductsList = () => {
      if (isShowProductsList) {
        return <ProductsList />;
      }
    };
    const renderProductsBuyed = () => {
      if (isShowProductsBuyed) {
        return <ProductsBuyed />;
      }
    };
    const renderNewProduct = () => {
      if (uploadNewProduct) {
        return <NewProduct />;
      }
    };

    const renderProfile = () => {
      return (
        <div
          style={{
            width: "100%",
            height: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className={s.container_profile}>
            <div className={s.profile_image_container}>
              <img src={profile} alt="profile" className={s.profile_image} />
            </div>
            <div className={s.profile_info_container}>
              <div className={s.profile_info}>
                <h4>{user.name}</h4>
                <h6>Wallet Address</h6>
                {renderUserWallets(user)}
              </div>
            </div>
          </div>
        </div>
      );
    };
    const renderModalWallet = () => {
      if (isRenderProfile) {
        return (
          <Modal
            show={this.state.showModalDocument}
            onHide={(e) => this.handleHideModalDocument()}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>
            <div className="border border-light p-4 rounded-md">
              <img src={wallet} alt="Wallet" className="w-full mb-4" />
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Paso para crear billetera en Cardano</h2>
              </div>
              <div id="accordion-collapse" data-accordion="collapse">
                <h2 id="accordion-collapse-heading-1">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    data-accordion-target="#accordion-collapse-body-1"
                    aria-expanded="true"
                    aria-controls="accordion-collapse-body-1"
                  >
                    <span>Paso 1: Obtener billetera</span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                </h2>
                <div id="accordion-collapse-body-1" className="hidden" aria-labelledby="accordion-collapse-heading-1">
                  <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">Su billetera en Cardano es la herramienta principal utilizada para interactuar con la Blockchain...</p>
                    <p className="text-gray-500 dark:text-gray-400">Las billeteras más populares en Cardano son:
                      <a href="https://eternl.io/" className="text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">eternl.io</a>,
                      <a href="https://gerowallet.io" className="text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">gerowallet.io</a>,
                      <a href="https://namiwallet.io" className="text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">namiwallet.io</a>,
                      <a href="https://yoroi-wallet.com" className="text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">yoroi-wallet.com</a>.
                    </p>
                  </div>
                </div>
                <h2 id="accordion-collapse-heading-2">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    data-accordion-target="#accordion-collapse-body-2"
                    aria-expanded="false"
                    aria-controls="accordion-collapse-body-2"
                  >
                    <span>Paso 2: Pendiente</span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                </h2>
                <div id="accordion-collapse-body-2" className="hidden" aria-labelledby="accordion-collapse-heading-2">
                  <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">La billetera recién creada es el sitio donde se van a guardar sus tokens de inversión...</p>
                    <p className="text-gray-500 dark:text-gray-400">Si presenta alguna inquietud en este proceso, por favor contacte a soporte.</p>
                  </div>
                </div>
                <h2 id="accordion-collapse-heading-3">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    data-accordion-target="#accordion-collapse-body-3"
                    aria-expanded="false"
                    aria-controls="accordion-collapse-body-3"
                  >
                    <span>Paso 3: Pendiente</span>
                    <svg
                      data-accordion-icon
                      className="w-3 h-3 rotate-180 shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                  </button>
                </h2>
                <div id="accordion-collapse-body-3" className="hidden" aria-labelledby="accordion-collapse-heading-3">
                  <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Conectar la billetera a la plataforma Suan: Una vez creada su billetera puede conectarla de forma segura al sitio web de Suan. En este caso, un botón de conectar se encuentra disponible en la parte superior derecha.</p>
                  </div>
                </div>
              </div>
            </div>

            </Modal.Body>
          </Modal>
        );
      }
    };

    return (
      <>
      <NewHeaderNavbar/>
      <div className="container-sm" style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* <Row>
          <HeaderNavbar
            changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
            handleSignOut={this.handleSignOut}
          ></HeaderNavbar>
        </Row> */}

        <div className="mt-4">
          {renderProductsList()}
          {/* {renderProfile()} */}
          {/* {renderOrders()} */}
          {/* {renderProductsBuyed()} */}
          {/* {renderNewProduct()} */}
          {/* {renderModalWallet()} */}
          {/* <NewProduct /> */}
        </div>
      </div>
      </>
    );
  }
}

export default ConstructorAdmon;
