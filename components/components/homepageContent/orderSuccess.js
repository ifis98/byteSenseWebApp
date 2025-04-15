// pages/order-success.js
'use client';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h4" color="error" gutterBottom>
        Thank you for your order!
      </Typography>
      <Button variant="outlined" color="error" onClick={() => router.push('/order')}>
        Create another Order
      </Button>
    </Container>
  );
}
