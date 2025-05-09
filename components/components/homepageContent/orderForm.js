'use client';
import * as React from 'react';
import { stripePromise } from '../../../lib/stripe';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';
import {
  Box, Button, Container, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent, CardHeader, Divider, Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import CustomTextField from "../CustomTextField";
import {CustomInputLabel, CustomSelect} from "../CustomSelect";

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

    if (!formData.caseName || !formData.maxUndercut || !formData.passiveSpacer || !formData.upperScan || !formData.lowerScan) {
      alert("All fields and STL files are required.");
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe failed to initialize.");
      return;
    }

    setLoading(true);

    const formPayload = new FormData();
    formPayload.append('caseName', formData.caseName);
    formPayload.append('arch', formData.arch);
    formPayload.append('type', formData.type);
    formPayload.append('maxUndercut', formData.maxUndercut);
    formPayload.append('passiveSpacer', formData.passiveSpacer);
    formPayload.append('instructions', formData.instructions);
    formPayload.append('upperScan', formData.upperScan);
    formPayload.append('lowerScan', formData.lowerScan);
    formPayload.append('clientName', doctorName); // send full name

    try {
      const res = await fetch(`${backendLink}createCheckoutSession`, {
        method: 'POST',
        body: formPayload,
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
      <Card elevation={3} sx={{ borderRadius: 3, background:'#242424' }}>
        <CardHeader title="Order Form" titleTypographyProps={{ variant: 'h5', color: 'error' }} />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  required
                  label="Case Name"
                  name="caseName"
                  value={formData.caseName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth required>
                  <CustomInputLabel id="arch-label" shrink>Arch</CustomInputLabel>
                  <CustomSelect
                    labelId="arch-label"
                    name="arch"
                    value={formData.arch}
                    onChange={handleChange}
                    label="Arch"
                  >
                    <MenuItem value="Upper">Upper</MenuItem>
                  </CustomSelect>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth required>
                  <CustomInputLabel id="type-label" shrink>Type</CustomInputLabel>
                  <CustomSelect
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="Flat Plane">Flat Plane</MenuItem>
                  </CustomSelect>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <CustomTextField
                  required
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
                <CustomTextField
                  required
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
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white' }}>
                  Upload Scans
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: 'white' }}>
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
                  Upload Upper Scan STL *
                  <input hidden type="file" accept=".stl" name="upperScan" onChange={handleFileChange} required />
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
                  Upload Lower Scan STL *
                  <input hidden type="file" accept=".stl" name="lowerScan" onChange={handleFileChange} required />
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
                <CustomTextField
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
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
