import React, { Component } from 'react'

// Components
import LandingPage from "./components/views/LandingPage.jsx";
import Admon from "./components/Admon/Admon";
import InvestorAdmon from "./components/Investor/InvestorAdmon";



// Routing
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

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
          {/* <Route
              path="/admon"
              render={(props) => <Admon {...props} />}
          /> */}
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App