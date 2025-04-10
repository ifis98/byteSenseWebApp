'use client';

import React, { Component } from "react";
import { Nav, Navbar } from "react-bootstrap";
import styles from "../../../styles/common.module.scss";

class Nav2 extends Component {
  render() {
    return (
      <Navbar
        id="Nav2"
        className={\`\${styles.homePageNav} bg-light\`}
        style={{ height: "60px" }}
      >
        <Nav.Link className="p-0" href="/list">
          <img
            id="drawerLogo"
            src="/logo.png"
            alt={"EPIC's Logo"}
          />
        </Nav.Link>
      </Navbar>
    );
  }
}

export default Nav2;