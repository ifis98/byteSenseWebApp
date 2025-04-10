import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import "./common.scss";
import { LinkContainer } from "react-router-bootstrap";

class Drawer extends Component {
  state = {
    hash: window.location.hash,
  };

  render() {
    return (
      <div id="Drawer" className="homePageDrawer">
        <img
          id="drawerLogo"
          src={require("../../assets/image.png")}
          alt={"EPIC's Logo"}
        />
        <ListGroup variant="flush">
          {/* <LinkContainer exact to="/">
            <ListGroup.Item action>
              <span className="material-icons">home</span>
              <span className="textDrawer"> Home</span>
            </ListGroup.Item>
          </LinkContainer> */}
          <LinkContainer exact to="/">
            <ListGroup.Item action active={false}>
              <span className="material-icons">home</span>
              <span className="textDrawer"> Home</span>
            </ListGroup.Item>
          </LinkContainer>
          <LinkContainer exact to="/list">
            <ListGroup.Item action active={false}>
              <span className="material-icons">perm_identity</span>
              <span className="textDrawer"> Patient List</span>
            </ListGroup.Item>
          </LinkContainer>
          <LinkContainer exact to="/request">
            <ListGroup.Item action active={false}>
              <span className="material-icons">group_add</span>
              <span className="textDrawer"> Patient Request</span>
            </ListGroup.Item>
          </LinkContainer>
          <LinkContainer exact to="/chat">
            <ListGroup.Item action active={false}>
              <span className="material-icons">chat_bubble_outline</span>
              <span className="textDrawer"> Chat Room</span>
            </ListGroup.Item>
          </LinkContainer>
          <LinkContainer exact to="/alerts">
            <ListGroup.Item action active={false}>
              <span className="material-icons">mail_outline</span>
              <span className="textDrawer"> Alerts</span>
            </ListGroup.Item>
          </LinkContainer>

          <LinkContainer exact to="/help">
            <ListGroup.Item action active={false}>
              <span className="material-icons">help_center</span>
              <span className="textDrawer"> Help Center</span>
            </ListGroup.Item>
          </LinkContainer>
        </ListGroup>
      </div>
    );
  }
}

export default Drawer;
