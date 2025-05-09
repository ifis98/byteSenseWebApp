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
import CustomTextField from "../components/components/CustomTextField";

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
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    unitNo: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: ['unitNo','zipCode'].includes(e.target.name) ? e.target.value.replace(/\D/g, '') : e.target.value,
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
        <Typography variant="h4" color="error" fontWeight={600}>
          Sign Up
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 3, color: 'white' }}>
          Create your byteSense account.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <CustomTextField
            fullWidth
            label="First Name"
            name="fName"
            value={form.fName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Last Name"
            name="lName"
            value={form.lName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Typography mt={2} variant="h6" color="error" style={{ textAlign: 'center', fontWeight: '800' }}>Practice address</Typography>
          <Typography variant="subtitle1" style={{ textAlign: 'center', color: 'white' }}>(This is where your orders will be shipped, this information can be changed in your profile settings)</Typography>
          <CustomTextField
              fullWidth
              label="Unit Number"
              name="unitNo"
              value={form.unitNo}
              onChange={handleChange}
              margin="normal"
          />
          <CustomTextField
              fullWidth
              label="Street Address"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
              margin="normal"
              required
              multiline={true}
              rows={2}
          />
          <CustomTextField
              fullWidth
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              margin="normal"
              required
          />
          <CustomTextField
              fullWidth
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              margin="normal"
              required
          />
          <CustomTextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={form.zipCode}
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
            color="error"
            size="large"
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>

          <Typography textAlign="center" mt={2}>
            <MuiLink
              href="/login"
              underline="hover"
              sx={{ color: 'error.main' }} // ensures red color
            >
              Already have an account? Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
