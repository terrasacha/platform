import React, { Component, useEffect, useState } from 'react';

// Components
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";
import Error from './components/views/Error';
import LandingPage from "./components/views/landingPage/LandingPage.jsx";
import { AuthProvider } from './context/AuthContext';
// Routing
// import { Auth } from 'aws-amplify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ValidatorAdmon from './components/Validator/Validation/ValidatorAdmon.jsx';
import Footer from './components/views/Footer/Footer';
import LogIn from './components/views/Login/Login';
import AdmonMiddleware from './components/views/middlewareRoute/AdmonMiddleware';
import InvestorMiddleware from './components/views/middlewareRoute/InvestorMiddleware';
import ValidatorMiddleware from './components/views/middlewareRoute/ValidatorMiddleware';
import SuccessOrder from './components/views/successOrder/SuccessOrder';

import CardanoConnector from './components/views/CardanoConnector/CardanoConnector';


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
{/*           <Route
            path="/cardano_connector"
            element={
                <CardanoConnector/>
            }
          /> */}
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