'use client'; // Needed for Next.js App Router

import React from "react";
import {
  Form,
  Button,
} from "react-bootstrap";
import { Container, Row } from "react-bootstrap";
import "./Form.scss";
import axios from "axios";
import { backendLink } from "../exports/variable";
import { useNavigate, useParams } from 'react-router-dom';

// Wrapper component to provide router functionality
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errorMessage: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  render() {
    return (
      <Container id="contForm">
        <Row className="justify-content-md-center">
          <img src={require("../assets/logo.png")} className="logoImg" alt="Logo" />
          <div className="vertical"></div>
          <Form name="loginForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className="logo-color">byteSense</h1>
              Please reset your password.
            </Form.Text>

            <Form.Group controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={this.state.password}
                placeholder="New Password"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                placeholder="Confirm Password"
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.state.errorMessage && (
              <p className="error"> {this.state.errorMessage} </p>
            )}
            <Button variant="primary" type="submit" className="loginButton">
              Update Password
            </Button>
          </Form>
        </Row>
      </Container>
    );
  }
  
  handleChange(event) {
    //this sets the updated form values
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();

    //this is called on click of reset password
    const { password, confirmPassword } = this.state;
    
    if (password !== confirmPassword) {
      this.setState({
        errorMessage: "Password and confirm password should match."
      });
      return;
    }
    
    console.log(backendLink + "user" + window.location.pathname);
    axios
      .put(backendLink + "user" + window.location.pathname, {
        password,
        confirmPassword,
      })
      .then((response) => {
        // Use the router for navigation
        if (this.props.router) {
          this.props.router.navigate("/");
        } else {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        this.setState({ errorMessage: "Please try again!!" });
      });
  }
}

// Remove the direct ReactDOM render call
// ReactDOM.render(<ResetPassword />, document.getElementById("root"));

export default withRouter(ResetPassword);