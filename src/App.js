import React from 'react';

// Components
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";
import ConstructorAdmon from "./components/Constructor/ConstructorAdmon";
import Error from './components/views/Error';
import LandingPage from "./components/views/landingPage/LandingPage.jsx";
import { AuthProvider } from './context/AuthContext';
import { ProjectDataProvider } from './context/ProjectDataContext';
// Routing
// import { Auth } from 'aws-amplify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ValidatorAdmon from './components/Validator/Validation/ValidatorAdmon.jsx';
import Footer from './components/views/Footer/Footer';
import LogIn from './components/views/Login/Login';
import AdmonMiddleware from './components/views/middlewareRoute/AdmonMiddleware';
import InvestorMiddleware from './components/views/middlewareRoute/InvestorMiddleware';
import ValidatorMiddleware from './components/views/middlewareRoute/ValidatorMiddleware';
import ConstructorMiddleware from './components/views/middlewareRoute/ConstructorMiddleware';
import SuccessOrder from './components/views/successOrder/SuccessOrder';
import Product from './components/views/Orders/Product';
import Products from './components/views/Products';
import CreateWallet from './components/views/createWallet/CreateWallet'
import TermCondition from './components/views/terms&conditions/TermCondition'
import PrivacyPolicy from './components/views/privacyPolicy/PrivacyPolicy'
import UseTerms from './components/views/useTerms/UseTerms';
import ProjectPage from './components/Constructor/ProjectPage/ProjectPage';

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage />
            }
            exact
          />
          <Route
            path="/project/:id"
            element={
              <ProjectDataProvider>
                <ProjectPage />
              </ProjectDataProvider>
            }
            exact
          />
          <Route
            path="/products"
            element={
              <Products />
            }
          />
          <Route
            path="/products/:id"
            element={
              <Product />
            }
          />
          <Route
            path="/creating_wallet"
            element={
              <CreateWallet />
            }
          />
          <Route
            path="/terms_&_conditions"
            element={
              <TermCondition />
            }
          />
          <Route
            path="/use_terms"
            element={
              <UseTerms />
            }
          />
          <Route
            path="/privacy_policy"
            element={
              <PrivacyPolicy />
            }
          />
          <Route
            path="/admon"
            element={
              <AdmonMiddleware>
                <Admon />
              </AdmonMiddleware>  
            }
          />

          <Route
            path="/investor_admon"
            element={
              <InvestorMiddleware>
                <InvestorAdmon />
              </ InvestorMiddleware>
            }
          />
          <Route
            path="/constructor"
            element={
              <ConstructorMiddleware>
                <ConstructorAdmon />
              </ConstructorMiddleware>
            }
          />
          <Route
            path="/validator_admon"
            element={
              <ValidatorMiddleware>
                <ValidatorAdmon />
              </ValidatorMiddleware>
            }
          />
          <Route
            path="/success_order"
            element={
              <InvestorMiddleware>
                <SuccessOrder/>
              </ InvestorMiddleware>
            }
          />
          <Route
            path="/login"
            element={
              <LogIn/>
            }
          />
          <Route
            path="/*"
            element={
              <Error/>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App