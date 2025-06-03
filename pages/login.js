"use client";

import React from "react";
import { Box, Button, Typography, Link as MuiLink, Alert } from "@mui/material";
import axios from "axios";
import { backendLink } from "../exports/variable";
import { connect } from "react-redux";
import { updateDoctorDetail } from "../actions/APIAction";
import CustomLabelTextField from "../components/components/CustomLabelTextField";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      errorMessage: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { userName, password } = this.state;

    axios
      .post(backendLink + "user/loginWeb", { userName, password })
      .then(async (response) => {
        await localStorage.setItem("token", response.data.token);
        this.props.updateDoctorDetail().then((results) => {
          if (results) {
            localStorage.setItem("open", true);
            window.location.href = "/";
          }
        });
      })
      .catch(() => {
        this.setState({
          errorMessage: "Invalid credentials. Please try again.",
          userName: "",
          password: "",
        });
      });
  };

  render() {
    const { userName, password, errorMessage } = this.state;

    return (
      <Box
        className={"flex flex-row justify-center items-center w-full"}
        sx={{ height: "100vh", width: "100%" }}
        style={{ backgroundColor: "#1d1d1d" }}
      >
        <Box
          className={
            "w-4/5 h-full flex items-center justify-center hidden md:block"
          }
          sx={{
            background: "#000000",
            backgroundImage:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.95) 20%, rgb(255 32 3 / 60%) 100%)",
          }}
        >
          <Box className={"w-full h-full flex items-center justify-center"}>
            <img
              src="/signin.png"
              alt="login Logo"
              className={"h-4/5 object-contain object-center rotate-50"}
            />
          </Box>
        </Box>
        <Box className={"w-full p-4 flex justify-center items-center h-full "}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            className={"w-full"}
            maxWidth={600}
            mx="auto"
          >
            <img
              src="/image.png"
              alt="byteSense Logo"
              style={{ width: 160, marginBottom: 16 }}
            />
            <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
              Welcome back
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
            >
              Please login to your account.
            </Typography>

            <Box
              component="form"
              onSubmit={this.handleSubmit}
              sx={{ mt: 3, width: "100%" }}
            >
              <CustomLabelTextField
                fullWidth
                label="Username"
                name="userName"
                value={userName}
                onChange={this.handleChange}
                margin="normal"
                required
                placeholder={"Enter your username"}
              />
              <CustomLabelTextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={password}
                onChange={this.handleChange}
                margin="normal"
                required
                placeholder={"Enter Password"}
              />

              {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color="error" // 🔴 red
                >
                  Login
                </Button>
                <Box mt={2} textAlign="center">
                  <MuiLink
                    underline="hover"
                    sx={{ color: "error.main" }} // 🔴 red link
                    href="/register"
                  >
                    Sign Up
                  </MuiLink>
                </Box>
              </Box>

              <Box mt={2} textAlign="center">
                <MuiLink
                  href="/forgotPassword"
                  underline="hover"
                  sx={{ color: "error.main" }} // 🔴 red link
                >
                  Forgot Password / Username?
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail()),
});

export default connect(null, mapDispatchToProps)(Login);
