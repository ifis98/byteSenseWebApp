import React, { Component } from "react";
import HomePageNav from "../components/common/nav";
import Drawer from "../components/common/drawer";
import PatientRequest from "../components/homepageContent/patientRequest";
import PatientList from "../components/homepageContent/patientList";
import PatientReport from "../components/homepageContent/patientReport";
import ComingSoon from "../components/homepageContent/comingSoon"

import "./HomePage.scss";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

class Homepage extends Component {
  switchComp() {
    let href =(window.location.pathname + window.location.hash);
    const findTerm = (term) => {
      if (href.includes(term)){
        return href;
      }
    };
    switch (href) {
      case "/list#report":
        return <PatientReport />;
      case findTerm("/#"): 
      case "/":
        return <ComingSoon/>

      case findTerm("/list"):
          return <PatientList />;  
      case findTerm("/chat"):
      case findTerm("/alerts"):
      case findTerm("/help"):
        return <ComingSoon/>
 
      case findTerm("/request"):
          return <PatientRequest />;
    }
  }
  render() {
    return (
      <div id="homePage">
        <HomePageNav />
        <Drawer />
        <Route exact component={this.switchComp} />
      </div>
    );
  }
}

export default Homepage;
