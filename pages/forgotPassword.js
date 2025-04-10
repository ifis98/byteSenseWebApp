'use client'; // Needed for Next.js App Router

import React from "react";
import {
  Form,
  Button,
} from "react-bootstrap";
import { Container, Row } from "react-bootstrap";
import styles from '../styles/Form.module.scss';
import { backendLink } from '../exports/variable';
import axios from "axios";

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
      <Container id="contForm" className={styles.contForm}>
        <Row className="justify-content-md-center">
          <img src="./image.png" className={styles.logoImg} alt="Logo" />
          <div className="vertical"></div>

          <Form name="ForgotForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className={styles["logo-color"]}>byteSense</h1>
              Enter your email and we’ll send you a password reset link.
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
              <p className={styles.success}>{this.state.errorMessage}</p>
            )}

            <Button variant="primary" type="submit" className={styles.loginButton}>
              Send Request
            </Button>
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

  handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;

    axios
      .post(backendLink + "user/forgotpassword", { email })
      .then(() => {
        this.setState({
          errorMessage: "Email sent successfully to the account.",
          email: "",
        });
      })
      .catch(() => {
        this.setState({
          errorMessage: "Please try again!",
          email: "",
        });
      });
  }
}

export default ForgotPassword;
