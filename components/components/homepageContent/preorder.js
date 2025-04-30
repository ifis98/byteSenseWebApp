'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import { stripePromise } from '../../../lib/stripe';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';

export default function PreOrderForm() {
  const [quantity, setQuantity] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const res = await user.userRequests().getProfile();
        if (res?.data?.profile) {
          const { fName = '', lName = '' } = res.data.profile;
          setDoctorName(`${fName} ${lName}`.trim());
        }
      } catch (err) {
        console.error('Failed to fetch doctor name:', err);
      }
    };

    fetchDoctorName();
  }, []);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const num = Number(value);
    const isPositiveInteger = Number.isInteger(num) && num > 0;
    setQuantity(value);
    setIsValid(isPositiveInteger);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe failed to initialize.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendLink}createPreorderSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: Number(quantity),
          clientName: doctorName,
        }),
      });

      const data = await res.json();
      if (!data.sessionId) {
        alert("Unable to initiate Stripe Checkout.");
        setLoading(false);
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) {
        alert(result.error.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardHeader
          title="Pre-Order Now!"
          titleTypographyProps={{ variant: 'h5', color: 'error' }}
        />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Preorder Quantity"
                  name="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, step: 1 }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                  disabled={!isValid || loading}
                  sx={{ py: 1.5, px: 6, minWidth: '240px', textTransform: 'uppercase' }}
                >
                  {loading ? "Processing..." : "Submit Preorder"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
