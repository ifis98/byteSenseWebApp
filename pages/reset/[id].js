'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { backendLink } from '../../exports/variable';

const ResetPassword = () => {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
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
      await axios.put(`${backendLink}user/reset/${params.id}`, form);
      router.push('/login');
    } catch (err) {
      setErrorMessage('Password reset failed. Please try again!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src="/image.png" alt="Logo" style={{ width: 160, marginBottom: 16 }} />
        <Typography variant="h4" color="primary" fontWeight={600}>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
          Enter your new password below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="New Password"
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
            Update Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
