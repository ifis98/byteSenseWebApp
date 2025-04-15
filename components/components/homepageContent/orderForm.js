'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function OrderForm() {
  const router = useRouter();
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate Stripe payment redirect
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const payload = {
      ...formData,
      upperScan: formData.upperScan?.name,
      lowerScan: formData.lowerScan?.name,
    };
    console.log('Payload for backend:', payload);
    router.push('/order-success');
  };

  // Helper function to truncate long file names
  const getFileName = (file, maxLength = 20) => {
    if (!file) return '';
    if (file.name.length <= maxLength) return file.name;
    const extension = file.name.split('.').pop();
    const nameWithoutExt = file.name.substring(0, file.name.length - extension.length - 1);
    const truncatedName =
      nameWithoutExt.substring(0, maxLength - extension.length - 3) + '...';
    return truncatedName + '.' + extension;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardHeader
          title="Order Form"
          titleTypographyProps={{ variant: 'h5', color: 'error' }}
          sx={{ pb: 0, px: 3 }}
        />
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Row 1: Case Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  label="Case Name"
                  name="caseName"
                  value={formData.caseName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Row 2: Arch, Type, Maximum Undercut, and Passive Spacer */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="arch-label">Arch</InputLabel>
                    <Select
                      labelId="arch-label"
                      label="Arch"
                      name="arch"
                      value={formData.arch}
                      onChange={handleChange}
                    >
                      <MenuItem value="Upper">Upper</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                      labelId="type-label"
                      label="Type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <MenuItem value="Flat Plane">Flat Plane</MenuItem>
                      <MenuItem value="Michigan Splint">Michigan Splint</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Maximum Undercut (mm)"
                    name="maxUndercut"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    value={formData.maxUndercut}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Passive Spacer (mm)"
                    name="passiveSpacer"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    value={formData.passiveSpacer}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Row 3: Upload Scans Title & Explanation */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Upload Scans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please upload your scan STLs oriented at the bite opening where the nightguard
                  should be created.
                </Typography>
              </Grid>

              {/* Row 4: File Upload Buttons in a Nested Grid */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      color="error"
                      sx={{ height: 56, width: '100%', textTransform: 'none' }}
                    >
                      Upload Upper Scan STL
                      <input
                        hidden
                        type="file"
                        accept=".stl"
                        name="upperScan"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {formData.upperScan && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Selected: {getFileName(formData.upperScan, 30)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      color="error"
                      sx={{ height: 56, width: '100%', textTransform: 'none' }}
                    >
                      Upload Lower Scan STL
                      <input
                        hidden
                        type="file"
                        accept=".stl"
                        name="lowerScan"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {formData.lowerScan && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Selected: {getFileName(formData.lowerScan, 30)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Row 5: Additional Instructions */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Additional Instructions"
                  name="instructions"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.instructions}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 6: Payment Button */}
              <Grid
                size={{ xs: 12 }}
                sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
              >
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
