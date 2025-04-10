'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  Button,
  Container,
  Row,
} from "react-bootstrap";
import styles from '../../styles/Form.module.scss';
import axios from "axios";
import { backendLink } from "../../exports/variable";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errorMessage: ""
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({
        errorMessage: "Password and confirm password should match."
      });
      return;
    }

    const { id, router } = this.props;

    axios
      .put(`${backendLink}user/reset/${id}`, {
        password,
        confirmPassword,
      })
      .then(() => {
        router.push("/login");
      })
      .catch(() => {
        this.setState({ errorMessage: "Please try again!!" });
      });
  }

  render() {
    return (
      <Container id="contForm" className={styles.contForm}>
        <Row className="justify-content-md-center">
          <img src="/image.png" className={styles.logoImg} alt="Logo" />
          <div className="vertical"></div>

          <Form name="resetForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className={styles["logo-color"]}>byteSense</h1>
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
              <p className={styles.error}>{this.state.errorMessage}</p>
            )}

            <Button variant="primary" type="submit" className={styles.loginButton}>
              Update Password
            </Button>
          </Form>
        </Row>
      </Container>
    );
  }
}

// Functional wrapper to pass router and id from URL params
export default function ResetPasswordWrapper(props) {
  const router = useRouter();
  const params = useParams();
  return <ResetPassword {...props} router={router} id={params.id} />;
}
