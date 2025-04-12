'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { backendLink } from '../exports/variable';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');

    try {
      await axios.post(`${backendLink}user/forgotpassword`, { email });
      setFeedbackMessage('Email sent successfully to the account.');
      setSuccess(true);
      setEmail('');
    } catch {
      setFeedbackMessage('Please try again!');
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img src="/image.png" alt="Logo" style={{ width: 160, marginBottom: 16 }} />
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
          Enter your email and we’ll send you a password reset link.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            margin="normal"
          />

          {feedbackMessage && (
            <Alert severity={success ? 'success' : 'error'} sx={{ mt: 2 }}>
              {feedbackMessage}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="error"  //  use red button theme
            size="large"
            sx={{ mt: 3 }}
          >
            Send Request
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
