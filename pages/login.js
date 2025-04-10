'use client'; // Needed for Next.js App Router

import React from "react";
import { Form, Button, Container, Row } from "react-bootstrap";
import styles from '../styles/Form.module.scss';
import axios from "axios";
import { backendLink } from "../exports/variable";
import { connect } from "react-redux";
import { updateDoctorDetail } from "../actions/APIAction";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { userName, password } = this.state;
    axios
      .post(backendLink + "user/loginWeb", { userName, password })
      .then(async (response) => {
        await localStorage.setItem("token", response["data"]["token"]);
        this.props.updateDoctorDetail().then(results => {
          if (results) {
            window.location.href = "/list";
          }
        });
      })
      .catch((err) => {
        this.setState({
          errorMessage: "Invalid Credentials. Please try again!!",
          userName: "",
          password: "",
        });
      });
  }

  render() {
    return (
      <Container id="contForm" className={styles.contForm}>
        <Row className="justify-content-md-center">
          <img src="/image.png" className={styles.logoImg} alt="byteSense Logo" />
          <div className="vertical"></div>

          <Form name="loginForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className={styles["logo-color"]}>byteSense</h1>
              Welcome back. Please login to your account.
            </Form.Text>

            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="userName"
                value={this.state.userName}
                type="text"
                placeholder="Username"
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={this.state.password}
                name="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </Form.Group>

            {this.state.errorMessage && (
              <p className={styles.error}> {this.state.errorMessage} </p>
            )}

            <Button variant="primary" type="submit" className={styles.loginButton}>
              Login
            </Button>
            <Button variant="primary" type="button" href="/register" className={styles.loginButton}>
              Signup
            </Button>

            <Form.Text className="text-muted">
              <a href="/forgotPassword">
                Forgot Password/Username
              </a>
            </Form.Text>
          </Form>
        </Row>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail())
});

export default connect(null, mapDispatchToProps)(Login);
