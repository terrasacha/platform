import React, { Component } from 'react';

// Components
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";
import LandingPage from "./components/views/LandingPage.jsx";



// Routing
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="landing_page" element={<LandingPage />} />
          <Route path="admon" element={<Admon/>} />
          <Route path="investor_admon" element={<InvestorAdmon/>} />
          {/* ToDd fat arrow for new Route version <Route
              path="/admon"
              render={(props) => <Admon {...props} />}
          /> */}
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App