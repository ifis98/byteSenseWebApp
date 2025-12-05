import React, { Component } from "react";
import Nav2 from "./components/common/nav2";
import Profile from "./components/profile/Profile";

import styles from "../styles/DentistProfile.module.scss"; // Styles for the profile layout and navigation shell



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