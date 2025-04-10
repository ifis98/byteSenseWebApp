import React, { Component } from "react";
import Nav2 from "../components/common/nav2";
import Profile from "../components/profile/Profile";

import "./DentistProfile.scss";


class DentistProfile extends Component {
  render() {
    return (
      <div className="DentistProfile">
        <Nav2/>
        <Profile/>
      </div>
    );
  }
}

export default DentistProfile;