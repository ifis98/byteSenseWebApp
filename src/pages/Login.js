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
import { connect } from "react-redux";
import { updateDoctorDetail } from "../actions/APIAction";
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Higher-order component to provide router props to class components
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let params = useParams();
    return <Component {...props} router={{ navigate, location, params }} />;
  }
  return ComponentWithRouterProp;
}

class Login extends React.Component {
  //loginForm: Form;
  data;
  swal;
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
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

          <Form name="loginForm" onSubmit={this.handleSubmit}>
            <Form.Text className="text-muted">
              <h1 className="logo-color">byteSense</h1>
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
              <p className="error"> {this.state.errorMessage} </p>
            )}
           
            <Button variant="primary" type="submit" className="loginButton">
              Login
            </Button>
            <Button variant="primary" type="button" href="/register">
              Signup
            </Button>
            <Form.Text className="text-muted">
              <a href="/forgotPassword" onClick={this.handleClick}>
                Forgot Password/Username
              </a>
            </Form.Text>
          </Form>
        </Row>
      </Container>
    );
  }
  handleChange(event) {
    //sets the updated form fields values
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  handleSubmit(event) {
    //this is called on click of login button and makes request to backend
    event.preventDefault();

    const { userName, password } = this.state;
    axios
      .post(backendLink + "user/loginWeb", { userName, password })
      .then(async (response) => {
        let Token = await localStorage.getItem("token");
        await localStorage.setItem("token", response["data"]["token"]);
        Token = await localStorage.getItem("token");
        this.props.updateDoctorDetail().then(results => {
          if(results){
            window.location.href = "/list";
          }
        })
      })
      .catch((err) => {
        this.setState({
          errorMessage: "Invalid Credentials. Please try again!!",
          userName: "",
          password: "",
        });
      });
  }
}

// Remove the ReactDOM.render call
// ReactDOM.render(<Login />, document.getElementById("root"));

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail())
});

export default connect(null, mapDispatchToProps)(withRouter(Login));