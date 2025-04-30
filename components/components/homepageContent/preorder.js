'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@mui/material';
import { useState } from 'react';

export default function PreOrderForm() {
  const [quantity, setQuantity] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const num = Number(value);
    const isPositiveInteger = Number.isInteger(num) && num > 0;
    setQuantity(value);
    setIsValid(isPositiveInteger);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    alert(`Pre-order submitted for ${quantity} unit(s)!`);
    // You can replace the above with your actual submission logic
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
                  disabled={!isValid}
                  sx={{ py: 1.5, px: 6, minWidth: '240px', textTransform: 'uppercase' }}
                >
                  Submit Preorder
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
