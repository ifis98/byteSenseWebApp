import React, { Component } from "react";
import Nav2 from "../components/common/nav2";
import BrokenRoute from "../components/redirectContent/brokenRoute";
import "./DentistProfile.scss";

class BrokenPage extends Component {
  render() {
    return (
      <div className="DentistProfile">
        <Nav2 />
        <BrokenRoute />
      </div>
    );
  }
}

export default BrokenPage;
