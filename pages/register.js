'use client';

import React from "react";
import {
  Form,
  Button,
  Container,
  Row,
} from "react-bootstrap";
import styles from '../styles/Form.module.scss';
import axios from "axios";
import { backendLink } from "../exports/variable";
import { useRouter } from 'next/router';

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
      errorMessage: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ errorMessage: "" });

    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
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
      .then(() => {
        this.props.router.push("/login");
      })
      .catch((error) => {
        if (error.response?.data?.message?.includes("userName")) {
          this.setState({ errorMessage: "User already exists. Please try again!!" });
        } else if (error.response?.data?.message?.includes("email")) {
          this.setState({ errorMessage: "Email already exists. Please try again!!" });
        } else {
          this.setState({ errorMessage: "Server Error" });
        }
      });
  };

  render() {
    return (
      <Container id="contForm" className={styles.contForm}>
        <Row className="justify-content-md-center">
          <img src="./image.png" className={styles.logoImg} alt="Logo" />
          <Form onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className={styles["logo-color"]}>byteSense</h1>
              We'll never share your email with anyone else.
            </Form.Text>

            <Form.Group controlId="fName">
              <Form.Label>First Name</Form.Label>
              <Form.Control required type="text" name="fName" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="lName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control required type="text" name="lName" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control required type="text" name="userName" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" name="email" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" name="password" maxLength="99" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control required type="password" name="confirmPassword" maxLength="99" onChange={this.handleChange} />
            </Form.Group>

            {this.state.errorMessage && <p className={styles.error}>{this.state.errorMessage}</p>}

            <Form.Group controlId="isDoctor" className={styles.hidden}>
              <Form.Control type="text" name="isDoctor" onChange={this.handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit" className={styles.loginButton}>Sign up</Button>
            <Form.Text className="text-muted" style={{ marginBottom: "50px" }}>
              <a href="/login">Already have an account? Sign in.</a>
            </Form.Text>
          </Form>
        </Row>
      </Container>
    );
  }
}

export default function RegisterWithRouter(props) {
  const router = useRouter();
  return <Register {...props} router={router} />;
}
