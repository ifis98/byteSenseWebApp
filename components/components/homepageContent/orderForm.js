'use client';
import * as React from 'react';
import { stripePromise } from '../../../lib/stripe';
import { backendLink } from '../../../exports/variable';
import {
  Box, Button, Container, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent, CardHeader, Divider, Grid
} from '@mui/material';
import { useState } from 'react';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    caseName: '',
    arch: 'Upper',
    type: 'Flat Plane',
    maxUndercut: '',
    passiveSpacer: '',
    upperScan: null,
    lowerScan: null,
    instructions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe failed to initialize.");
      return;
    }

    const payload = {
      caseName: formData.caseName,
      arch: formData.arch,
      type: formData.type,
      maxUndercut: formData.maxUndercut,
      passiveSpacer: formData.passiveSpacer,
      instructions: formData.instructions,
      upperScanName: formData.upperScan?.name,
      lowerScanName: formData.lowerScan?.name,
    };

    try {
      const res = await fetch(`${backendLink}createCheckoutSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.sessionId) {
        alert("Unable to initiate Stripe Checkout.");
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) {
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const getFileName = (file, maxLength = 20) => {
    if (!file) return '';
    const name = file.name;
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const base = name.slice(0, name.length - extension.length - 1);
    return `${base.slice(0, maxLength - extension.length - 4)}....${extension}`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardHeader title="Order Form" titleTypographyProps={{ variant: 'h5', color: 'error' }} />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Case Name"
                  name="caseName"
                  value={formData.caseName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="arch-label">Arch</InputLabel>
                  <Select labelId="arch-label" name="arch" value={formData.arch} onChange={handleChange}>
                    <MenuItem value="Upper">Upper</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select labelId="type-label" name="type" value={formData.type} onChange={handleChange}>
                    <MenuItem value="Flat Plane">Flat Plane</MenuItem>
                    <MenuItem value="Michigan Splint">Michigan Splint</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Maximum Undercut (mm)"
                  name="maxUndercut"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={formData.maxUndercut}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Passive Spacer (mm)"
                  name="passiveSpacer"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={formData.passiveSpacer}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Upload Scans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please upload your scan STLs oriented at the bite opening where the nightguard should be created.
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Button
                  component="label"
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ height: 56, textTransform: 'none' }}
                >
                  Upload Upper Scan STL
                  <input hidden type="file" accept=".stl" name="upperScan" onChange={handleFileChange} />
                </Button>
                {formData.upperScan && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    Selected: {getFileName(formData.upperScan, 30)}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Button
                  component="label"
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{ height: 56, textTransform: 'none' }}
                >
                  Upload Lower Scan STL
                  <input hidden type="file" accept=".stl" name="lowerScan" onChange={handleFileChange} />
                </Button>
                {formData.lowerScan && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    Selected: {getFileName(formData.lowerScan, 30)}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Additional Instructions"
                  name="instructions"
                  multiline
                  rows={4}
                  value={formData.instructions}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                  sx={{ py: 1.5, px: 6, minWidth: '240px', textTransform: 'uppercase' }}
                >
                  Proceed to Payment
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
