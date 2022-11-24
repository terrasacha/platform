import React, { Component } from 'react';

// Components
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";
import Error from './components/views/Error';
import LandingPage from "./components/views/LandingPage.jsx";
// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SuccessOrder from './components/views/successOrder/SuccessOrder';

// import CardanoConnector from './components/views/CardanoConnector/CardanoConnector';

class App extends Component{
  
  constructor() {
    super()
    this.state = {
    }
  }

  async componentDidMount() {
  }

  render() {
    
    return (   
      <Router>

          <Switch>

            <Route
              path="/"
              render={(props) => <LandingPage {...props} />}
              exact
            />

            <Route
              path="/admon"
              render={(props) => <Admon {...props} />}
            />

            <Route
              path="/investor_admon"
              render={(props) => <InvestorAdmon {...props} />}
            />
            <Route
              path="/success_order"
              render={(props) => <SuccessOrder/>}
            />
            <Route
              path="/*"
              render={(props) => <Error/>}
            />

            {/* <Route
              path="/cardano_connector"
              render={(props) => <CardanoConnector {...props} />}
            /> */}
            
            
          {/* <Route path="landing_page" element={<LandingPage />} /> */}
          {/* <Route path="admon" element={<Admon/>} /> */}
          {/* <Route path="investor_admon" element={<InvestorAdmon/>} /> */}
          {/* <Route path="cardano_connector" element={<CardanoConnector/>} /> */}
            
            {/* <Redirect to="/landing-page" /> */}
            {/* <Redirect from="/" to="/filter_products" /> */}
          </Switch>

        {/* <Footer/> */}
      </Router>
    )
  }
}

export default App