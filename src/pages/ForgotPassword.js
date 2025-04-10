'use client'; // Needed for Next.js App Router

import React from "react";
import {
  Form,
  Button,
} from "react-bootstrap";
import { Container, Row } from "react-bootstrap";
import "./Form.scss";
import { backendLink } from '../exports/variable';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Wrapper component to provide router functionality
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }
  return ComponentWithRouterProp;
}

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    return (
      <Container id="contForm">
        <Row className="justify-content-md-center">
          <img src={require("./image.png")} className="logoImg" alt="Logo" />
          <div className="vertical"></div>
          <Form name="ForgotForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className="logo-color">byteSense</h1>
              Enter your email and we send you a password reset link.
            </Form.Text>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.state.errorMessage && (
              <p className="success"> {this.state.errorMessage} </p>
            )}
            <Button variant="primary" type="submit" className="loginButton">
              Send Request
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
    //this is called when user clicks on forgot password
    event.preventDefault();
    const { email } = this.state;
    axios
      .post(backendLink + "user/forgotpassword", { email })
      .then((response) => {
        this.setState({
          errorMessage: "Email is sent successfully to the email account.", 
          email: "",
        });
        // Navigation could be added here if needed using this.props.navigate
      })
      .catch((err) => {
        this.setState({ 
          errorMessage: "Please try again!!", 
          email: "" 
        });
      });
  }
}

// Do not render directly to DOM in Next.js
// ReactDOM.render(<ForgotPassword />, document.getElementById("root"));

// Export with router support for potential navigation needs
export default withRouter(ForgotPassword);