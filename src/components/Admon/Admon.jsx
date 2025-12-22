import React, { Component } from "react";
// Auth
import { Auth } from "aws-amplify";
// Nota: React Bootstrap reemplazado con Tailwind CSS
// Components
import UserProducts from "./UserProducts/UserProducts";
import AdmonProfile from "./AdmonProfile/AdmonProfile";
import Categorys from "./Categorys/Categorys";
import Items from "./Items/Items";
import Configure from "./Configure/Configure";
import Documents from "./Documents/Documents";
import Features from "./Features/Features";
import Formulas from "./Formulas/Formulas";
import HeaderNavbar from "./Navbars/HeaderNavbar";
import Validators from "./Validators/Validators";
import ManageMarketplaceAdmin from "./ManageMarketplaceAdmin/ManageMarketplaceAdmin";
import CheckAppStatus from "./CheckAppStatus";
import Products from "./Products/Products";
import Results from "./Results/Results";
import UOM from "./UOM/UOM";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../../graphql/mutations";
import AssignPF from "./AssignPF/AssignPF";
import { ToastContainer } from "react-toastify";
import Analysts from "./Analitic/Analysts";
import AssignAnalyst from "./assignAnali/AssignAnalyst";
import Legales from "./Legal/Legales";
import AssignLegal from "./assign_Legales/Assign_Legales";
import { navigate } from "../../utilities/navigate";

export default class Admon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actualUser: null,
      isActualUserLogged: true,
      user: {
        id: "",
        name: "",
        dateOfBirth: "",
        isProfileUpdated: false,
        addresss: "",
        latitude: "",
        longitude: "",
        cellphone: "",
      },
      isShowAdmonProfile: false,
      isShowProducts: true,
      isShowCategorys: false,
      isShowFeatures: false,
      isShowNotAuthorize: false,
      isShowUOM: false,
      isShowFormulas: false,
      isShowValidators: false,
      isShowMarketplaceAdmin: false,
      isShowResults: false,
      isShowDocuments: false,
      isShowAPF: false,
      isShowAProducts: false,
      isShowConfigure: false,
      isShowAnalysts: false,
      isShowAppStatus: false,
      isShowAssign_analyst: false,
      isShowLegal: false,
      isShowAssign_legales: false,
    };
    this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this);
    this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this);
    this.handleCUUser = this.handleCUUser.bind(this);
    this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this);
    this.setUserIDUsingCognitoSignedUser =
      this.setUserIDUsingCognitoSignedUser.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.applyTabFromLocation = this.applyTabFromLocation.bind(this);
  }

  applyTabFromLocation(location) {
    if (!location) return;

    const search = location.search || "";
    const params = new URLSearchParams(search);
    const tab = params.get("tab") || "products";

    // Solo aceptar tabs conocidos para evitar estados inválidos
    const allowedTabs = [
      "admon_profile",
      "products",
      "categorys",
      "items",
      "features",
      "uom",
      "formulas",
      "results",
      "documents",
      "assign_products",
      "validation",
      "settings",
      "validators",
      "assign_pf",
      "marketplace_admin",
      "apps_status",
      "analysts",
      "assign_analyst",
      "legales",
      "assign_Legales",
    ];

    const request = allowedTabs.includes(tab) ? tab : "products";
    this.changeHeaderNavBarRequest(request);
  }

  async componentDidMount() {
    if (this.props.location) {
      this.applyTabFromLocation(this.props.location);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.location?.search !== this.props.location?.search) {
      this.applyTabFromLocation(this.props.location);
    }
  }
  async handleSignOut() {
    try {
      await Auth.signOut();
      localStorage.removeItem("role");
      this.setState({ actualUser: null, isActualUserLogged: false });
      navigate("/");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async setUserGraphQLUser(pUser) {
    await this.setState({ user: pUser });
  }

  async changeHeaderNavBarRequest(pRequest) {
    if (pRequest === "admon_profile") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: true,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAppStatus: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "analysts") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAppStatus: false,
        isShowAnalysts: true,
        isShowAssign_analyst: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "assign_analyst") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAppStatus: false,
        isShowAnalysts: false, // Mostrar analistas
        isShowAssign_analyst: true,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "user_not_authorize") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: true,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAppStatus: false,
        isShowAssign_analyst: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "products") {
      this.setState({
        isShowProducts: true,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAppStatus: false,
        isShowAssign_analyst: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "categorys") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: true,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
      });
    }

    if (pRequest === "items") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: true,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "features") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: true,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "uom") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: true,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "formulas") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: true,
        isShowValidators: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "results") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowValidators: false,
        isShowResults: true,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "documents") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowValidators: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: true,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "assign_products") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowValidators: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: true,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "validation") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowValidators: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "settings") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowValidators: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowAProducts: false,
        isShowConfigure: true,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "validators") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: true,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "assign_pf") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: true,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "marketplace_admin") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: true,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "apps_status") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: true,
        isShowLegal: false,
        isShowAssign_legales: false,
      });
    }
    if (pRequest === "legales") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: true,
        isShowAssign_legales: false,
      });
    }

    if (pRequest === "assign_Legales") {
      this.setState({
        isShowProducts: false,
        isShowCategorys: false,
        isShowItems: false,
        isShowFeatures: false,
        isShowAdmonProfile: false,
        isShowNotAuthorize: false,
        isShowUOM: false,
        isShowFormulas: false,
        isShowResults: false,
        isShowDocuments: false,
        isShowValidators: false,
        isShowAProducts: false,
        isShowConfigure: false,
        isShowAPF: false,
        isShowMarketplaceAdmin: false,
        isShowAnalysts: false,
        isShowAssign_analyst: false,
        isShowAppStatus: false,
        isShowLegal: false,
        isShowAssign_legales: true,
      });
    }
  }

  async handleCUUser(pIsNewUser) {
    let tempUser = this.state.user;
    tempUser.isProfileUpdated = true;
    // To updates
    if (!pIsNewUser) {
      delete tempUser.ordersClient;
      delete tempUser.ordersWiller;
      delete tempUser.createdAt;
      delete tempUser.updatedAt;
      tempUser.dateOfBirth = "2000-10-01";
      await API.graphql(graphqlOperation(updateUser, { input: tempUser }));
    }
    this.setState({ isRenderCompleteOrUpdateProfile: false });
  }

  async handleOnChangeInputForm(event) {
    if (event.target.name === "user.name") {
      let tempUser = this.state.user;
      tempUser.name = event.target.value.toUpperCase();
      await this.setState({ user: tempUser });
    }
    if (event.target.name === "user.addresss") {
      let tempUser = this.state.user;
      tempUser.addresss = event.target.value.toUpperCase();
      await this.setState({ user: tempUser });
    }
    if (event.target.name === "user.cellphone") {
      let tempUser = this.state.user;
      tempUser.cellphone = event.target.value;
      await this.setState({ user: tempUser });
    }
  }

  async setUserIDUsingCognitoSignedUser(pID) {
    let tempUser = this.state.user;
    tempUser.id = pID;
    await this.setState({ user: tempUser });
  }

  // RENDER
  render() {
    let {
      isShowProducts,
      isShowCategorys,
      isShowItems,
      isShowFeatures,
      isShowAdmonProfile,
      isShowNotAuthorize,
      isShowUOM,
      isShowFormulas,
      isShowResults,
      isShowDocuments,
      isShowValidators,
      isShowAProducts,
      isShowConfigure,
      isShowAPF,
      isShowMarketplaceAdmin,
      isShowAppStatus,
      isShowAnalysts,
      isShowAssign_analyst,
      isShowLegal,
      isShowAssign_legales,
    } = this.state;
    return (
      <div className="min-h-screen bg-gradient-terrasacha-subtle font-typographica">
        {/* Main Content Area */}
        <main className="px-4 py-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 max-w-9xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-terrasacha-light/20 overflow-hidden animate-fade-in">
            {/* Content Header */}
            <div className="bg-terrasacha-primary px-6 py-4">
              <h1 className="text-2xl font-bold text-white font-champagne tracking-wide">
                Panel de Administración - Terrasacha
              </h1>
              <p className="text-terrasacha-earth mt-1 font-typographica">
                Gestión integral de la plataforma "Pioneros del Mañana"
              </p>
            </div>

            {/* Main Content Container */}
            <div className="p-6 min-h-screen-75">
              {isShowAdmonProfile && (
                <div className="animate-slide-up">
                  <AdmonProfile
                    user={this.state.user}
                    setUserIDUsingCognitoSignedUser={
                      this.setUserIDUsingCognitoSignedUser
                    }
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    setUserGraphQLUser={this.setUserGraphQLUser}
                    handleOnChangeInputForm={this.handleOnChangeInputForm}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowProducts && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Gestión de Proyectos
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Products
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                  />
                </div>
              )}
              
              {isShowCategorys && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Gestión de Categorías
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Categorys
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowItems && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Items de Proyectos
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Items
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowFeatures && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Características
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Features
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowUOM && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Unidades de Medida
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <UOM
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowFormulas && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Fórmulas
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Formulas
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowResults && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Resultados
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Results
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowDocuments && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Documentos
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Documents
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowAnalysts && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Gestión de Analistas
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Analysts
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowAssign_analyst && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Asignar Analistas
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <AssignAnalyst
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowLegal && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Gestión Legal
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Legales
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowAssign_legales && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Asignar Equipo Legal
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <AssignLegal
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
              
              {isShowNotAuthorize && (
                <div className="animate-scale-in">
                  <div className="bg-terrasacha-earth/10 border-l-4 border-terrasacha-earth p-4 rounded-md">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-terrasacha-secondary1 font-medium">
                          ⚠️ Perfil no autorizado
                        </p>
                        <p className="mt-1 text-sm text-terrasacha-secondary1">
                          No tienes permisos para acceder a esta sección. Contacta al administrador si necesitas acceso.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {isShowAProducts && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Productos de Usuario
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <UserProducts />
                </div>
              )}
              
              {isShowAPF && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Asignar Consultores
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <AssignPF />
                </div>
              )}
              
              {isShowValidators && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Gestión de Consultores
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Validators />
                </div>
              )}
              
              {isShowMarketplaceAdmin && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Administración del Marketplace
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <ManageMarketplaceAdmin />
                </div>
              )}
              
              {isShowAppStatus && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Estado de Aplicaciones
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <CheckAppStatus />
                </div>
              )}
              
              {isShowConfigure && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                      Configuración del Sistema
                    </h2>
                    <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                  </div>
                  <Configure
                    user={this.state.user}
                    changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    handleCUUser={this.handleCUUser}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Toast Container with Terrasacha styling */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="shadow-terrasacha border-l-4 border-terrasacha-primary"
        />
      </div>
    );
  }
}
