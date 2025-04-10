'use client'; // Needed for Next.js App Router

import React from "react";
import {
  Form,
  Button,
  Container,
  Row,
} from "react-bootstrap";
import "./Form.scss";
import axios from "axios";
import { backendLink } from "../exports/variable";
import { useNavigate } from 'react-router-dom'; // Use React Router's navigation

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: "",
      lName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      isDoctor: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    return (
      <Container id="contForm">
        <Row className="justify-content-md-center">
          <img src={require("./image.png")} className="logoImg" alt="Logo" />
          <Form onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className="logo-color">byteSense</h1>
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Group controlId="fName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="fName"
                placeholder="First Name"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="lName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="lName"
                placeholder="Last Name"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                type="text"
                name="userName"
                placeholder="Username"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                placeholder="Email"
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                placeholder="Password"
                maxLength="99"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                maxLength="99"
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.state.errorMessage && (
              <p className="error"> {this.state.errorMessage} </p>
            )}
            <Form.Group controlId="isDoctor" className="hidden">
              <Form.Control
                type="text"
                name="isDoctor"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign up
            </Button>
            <Form.Text className="text-muted" style={{ marginBottom: "50px" }}>
              <a href="/login" onClick={this.handleClick}>
                Already have an account? Sign in.
              </a>
            </Form.Text>
          </Form>
        </Row>
      </Container>
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ errorMessage: "" });

    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        errorMessage: "Password and confirm password should be same.",
      });
      return;
    }
    const {
      fName,
      lName,
      userName,
      email,
      password,
      confirmPassword,
      isDoctor,
    } = this.state;

    axios
      .post(backendLink + "user/signup", {
        fName,
        lName,
        userName,
        email,
        password,
        confirmPassword,
        isDoctor,
      })
      .then((response) => {
        // Use the navigate function from props
        if (this.props.navigate) {
          this.props.navigate("/");
        }
      })
      .catch((error) => {
        if (error.response?.data?.message?.includes("userName")) {
          this.setState({
            errorMessage: "User already exists. Please try again!!",
          });
          return;
        }
        if (error.response?.data?.message?.includes("email")) {
          this.setState({
            errorMessage: "Email already exists. Please try again!!",
          });
          return;
        }

        this.setState({ errorMessage: "Server Error" });
      });
  };
}

// Wrapper component to provide React Router's navigate function to the class component
export default function RegisterWithRouter(props) {
  const navigate = useNavigate();
  return <Register {...props} navigate={navigate} />;
}