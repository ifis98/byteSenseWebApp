'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
  Alert
} from '@mui/material';
import axios from 'axios';
import { backendLink } from '../exports/variable';
import { connect } from 'react-redux';
import { updateDoctorDetail } from '../actions/APIAction';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      errorMessage: '',
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { userName, password } = this.state;

    axios
      .post(backendLink + 'user/loginWeb', { userName, password })
      .then(async (response) => {
        await localStorage.setItem('token', response.data.token);
        this.props.updateDoctorDetail().then((results) => {
          if (results) {
            window.location.href = '/list';
          }
        });
      })
      .catch(() => {
        this.setState({
          errorMessage: 'Invalid credentials. Please try again.',
          userName: '',
          password: '',
        });
      });
  };

  render() {
    const { userName, password, errorMessage } = this.state;

    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src="/image.png" alt="byteSense Logo" style={{ width: 160, marginBottom: 16 }} />
          <Typography variant="subtitle1" gutterBottom>
            Welcome back. Please login to your account.
          </Typography>

          <Box component="form" onSubmit={this.handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              name="userName"
              value={userName}
              onChange={this.handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
              margin="normal"
              required
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
              <Button
                variant="outlined"
                fullWidth
                size="large"
                href="/register"
                color="error" // 🔴 red
              >
                Sign Up
              </Button>
            </Box>

            <Box mt={2} textAlign="center">
              <MuiLink
                href="/forgotPassword"
                underline="hover"
                sx={{ color: 'error.main' }} // 🔴 red link
              >
                Forgot Password / Username?
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail()),
});

export default connect(null, mapDispatchToProps)(Login);
