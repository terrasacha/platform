import React from "react";

// Components
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";
import ConstructorAdmon from "./components/Constructor/ConstructorAdmon";
import PropertyBanner from "./components/Constructor/PropertyBanner";
import Error from "./components/views/Error";
import LandingPage from "./components/views/landingPage/LandingPage.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ProjectDataProvider } from "./context/ProjectDataContext";
// Routing
// import { Auth } from 'aws-amplify';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ValidatorAdmon from "./components/Validator/Validation/ValidatorAdmon.jsx";
import LogIn from "./components/views/Login/Login";
import Sidebar from "./components/common/Sidebar";
import RoleMiddleware from "./components/views/middlewareRoute/RoleMiddleware";
import SuccessOrder from "./components/views/successOrder/SuccessOrder";
import Product from "./components/views/Orders/Product";
import Products from "./components/views/Products";
import CreateWallet from "./components/views/createWallet/CreateWallet";
import TermCondition from "./components/views/terms&conditions/TermCondition";
import PrivacyPolicy from "./components/views/privacyPolicy/PrivacyPolicy";
import UseTerms from "./components/views/useTerms/UseTerms";
import ProjectPage from "./components/Constructor/ProjectPage/ProjectPage";
import NewProject from "components/Constructor/NewProject/NewProject";
import Dashboard from "components/Dashboard/Dashboard";
import NewCampaign from "components/Constructor/Campaign/NewCampaign";
import Campaign from "components/Constructor/Campaign/Campaign";
import CampaignList from "components/Constructor/Campaign/CampaignList";
import PQRForm from "components/views/landingPage/PQRForm";
import Property from "components/Property/Property";
import Property2 from "components/Property2/Property";
import { PropertyDataProvider } from "context/PropertyDataContext";
import MobileOwnerValidation from "components/Property2/MobileOwnerValidation";
import AnalitycsAdmon from "components/Admon/Analitic/AnalitycsAdmon";
import "./App.css";
import { S3ClientProvider } from "context/s3ClientContext";
import LegalAdmon from "components/Legal/LegalAdmon";
import LegalBanner from "components/Legal/LegalBanner";
import ConsultorBanner from "components/Validator/ConsultorBanner";
import TradicionLibertad from "components/views/Footer/TradicionLibertad";
import Escrituras from "components/views/Footer/Escrituras";
import PlanosCatastrales from "components/views/Footer/PlanosCatastrales";
import SettingsPage from "components/views/Settings/SettingsPage";

const AdmonWithLocation = () => {
  const location = useLocation();
  return <Admon location={location} />;
};

function App() {
  const handleUserSettings = () => {
    // Lógica para manejar el click en configuración de usuario
    // Esta función se puede pasar al Sidebar si es necesario
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <div className="min-h-screen bg-gradient-to-br from-terrasacha-light to-white">
            <Routes>
              <Route path="/" element={<LandingPage />} exact />
              <Route path="/login" element={<LogIn />} />
              <Route
                path="/project/:id"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={[
                        "constructor",
                        "admon",
                        "investor",
                        "validator",
                        "analyst",
                      ]}
                      redirectPath="/"
                    >
                      <ProjectDataProvider>
                        <ProjectPage />
                      </ProjectDataProvider>
                    </RoleMiddleware>
                  </Sidebar>
                }
                exact
              />
              <Route path="/admindash" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <RoleMiddleware allowedRoles={["admon"]} redirectPath="/">
                    <Dashboard />
                  </RoleMiddleware>
                </Sidebar>
              } exact />
              <Route
                path="/new_project"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={["constructor", "admon"]}
                      redirectPath="/"
                    >
                      <NewProject />
                    </RoleMiddleware>
                  </Sidebar>
                }
                exact
              />
              <Route path="/products" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <Products />
                </Sidebar>
              } />
              <Route path="/PQRS" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <PQRForm />
                </Sidebar>
              } />
              <Route
                path="/products/:id"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={[
                        "constructor",
                        "admon",
                        "investor",
                        "validator",
                      ]}
                      redirectPath="/"
                    >
                      <Product />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route path="/creating_wallet" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <CreateWallet />
                </Sidebar>
              } />
              <Route path="/terms_&_conditions" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <TermCondition />
                </Sidebar>
              } />
              <Route path="/use_terms" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <UseTerms />
                </Sidebar>
              } />
              <Route path="/privacy_policy" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <PrivacyPolicy />
                </Sidebar>
              } />
              <Route
                path="/admon"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["admon"]} redirectPath="/">
                      <AdmonWithLocation />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />

              <Route
                path="/investor_admon"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["investor"]} redirectPath="/">
                      <InvestorAdmon />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/constructor/home"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={["constructor", "investor"]}
                      redirectPath="/"
                    >
                      <PropertyBanner />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/constructor"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={["constructor"]}
                      redirectPath="/"
                    >
                      <ConstructorAdmon />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/project_analyst"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["analyst"]} redirectPath="/">
                      <AnalitycsAdmon />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/consultor_admon"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["validator"]} redirectPath="/">
                      <ValidatorAdmon />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/consultor/home"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["validator"]} redirectPath="/">
                      <ConsultorBanner />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/legal/home"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["legal"]} redirectPath="/">
                      <LegalBanner />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/legal_admon"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["legal"]} redirectPath="/">
                      <LegalAdmon />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route
                path="/success_order"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware allowedRoles={["investor"]} redirectPath="/">
                      <SuccessOrder />
                    </RoleMiddleware>
                  </Sidebar>
                }
              />
              <Route path="/new_campaign" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <NewCampaign />
                </Sidebar>
              } />
              <Route
                path="/property/:id"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={[
                        "constructor",
                        "admon",
                        "investor",
                        "validator",
                        "legal",
                        "analyst",
                      ]}
                      redirectPath="/"
                    >
                      <ProjectDataProvider>
                        <PropertyDataProvider>
                          <S3ClientProvider>
                            <Property2 />
                          </S3ClientProvider>
                        </PropertyDataProvider>
                      </ProjectDataProvider>
                    </RoleMiddleware>
                  </Sidebar>
                }
                exact
              />
              <Route
                path="/propertyOld/:id"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={[
                        "constructor",
                        "admon",
                        "investor",
                        "validator",
                        "legal",
                        "analyst",
                      ]}
                      redirectPath="/"
                    >
                      <ProjectDataProvider>
                        <PropertyDataProvider>
                          <S3ClientProvider>
                            <Property />
                          </S3ClientProvider>
                        </PropertyDataProvider>
                      </ProjectDataProvider>
                    </RoleMiddleware>
                  </Sidebar>
                }
                exact
              />
              <Route path="/tradicion-libertad" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <TradicionLibertad />
                </Sidebar>
              } />
              <Route path="/escrituras" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <Escrituras />
                </Sidebar>
              } />
              <Route path="/planos-catastrales" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <PlanosCatastrales />
                </Sidebar>
              } />
              <Route path="/campaigns" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <CampaignList />
                </Sidebar>
              } />
              <Route path="/campaign/:id" element={
                <Sidebar onUserSettingsClick={handleUserSettings}>
                  <Campaign />
                </Sidebar>
              } exact />
              <Route
                path="/validate-owner/:token"
                element={
                  <S3ClientProvider>
                    <MobileOwnerValidation />
                  </S3ClientProvider>
                }
              />
              <Route
                path="/settings"
                element={
                  <Sidebar onUserSettingsClick={handleUserSettings}>
                    <RoleMiddleware
                      allowedRoles={[
                        "constructor",
                        "admon",
                        "investor",
                        "validator",
                        "analyst",
                        "legal"
                      ]}
                      redirectPath="/"
                    >
                      <SettingsPage />
                    </RoleMiddleware>
                  </Sidebar>
                }
                exact
              />
              {/* <Route path="/lists3" element={<ListS3 />} /> */}
              <Route path="/*" element={<Error />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
