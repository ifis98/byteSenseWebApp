import React, { Component } from "react";
import { Nav, Navbar, NavDropdown, FormControl } from "react-bootstrap";
import "./common.scss";

class Nav2 extends Component {
  render() {
    return (
      <Navbar
        id="Nav2"
        className="homePageNav bg-light"
        style={{ height: "60px" }}
      >
        <Nav.Link className="p-0" href="/list">
          <img
            id="drawerLogo"
            src={require("../../assets/logo.png")}
            alt={"EPIC's Logo"}
          />
        </Nav.Link>
      </Navbar>
    );
  }
}

export default Nav2;
