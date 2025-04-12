'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { backendLink } from '../exports/variable';

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fName: '',
    lName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    isDoctor: true,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (form.password !== form.confirmPassword) {
      return setErrorMessage('Password and confirm password must match.');
    }

    try {
      await axios.post(backendLink + 'user/signup', form);
      router.push('/login');
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (msg.includes('userName')) {
        setErrorMessage('Username already exists. Please try again.');
      } else if (msg.includes('email')) {
        setErrorMessage('Email already exists. Please try again.');
      } else {
        setErrorMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src="/image.png" alt="Logo" style={{ width: 160, marginBottom: 16 }} />
        <Typography variant="h4" color="primary" fontWeight={600}>
          Sign Up
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
          Create your byteSense account.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="First Name"
            name="fName"
            value={form.fName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lName"
            value={form.lName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>

          <Typography textAlign="center" mt={2}>
            <MuiLink href="/login" underline="hover">
              Already have an account? Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
