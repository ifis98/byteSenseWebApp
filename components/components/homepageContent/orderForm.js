'use client';
import * as React from 'react';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';
import {
  Box, Button, Container, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent, CardHeader, Divider, Grid
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import CustomTextField from "../CustomTextField";
import {CustomInputLabel, CustomSelect} from "../CustomSelect";
import { useSelector } from "react-redux";
import SignatureCanvas from 'react-signature-canvas'

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
  const sigCanvas = useRef(null);
  const sigContainerRef = useRef(null);

  // E-signature state
  const [savedSignatures, setSavedSignatures] = useState([]); // [{ id, name, dataUrl }]
  const [selectedSignatureId, setSelectedSignatureId] = useState('');

  const state = useSelector((state) => state.page);

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
    // Load saved signatures from localStorage
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('bs_saved_signatures') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedSignatures(parsed);
      }
    } catch (e) {
      console.warn('Unable to load saved signatures');
    }
    // Resize signature canvas to container width
    const resizeCanvasToContainer = () => {
      if (!sigCanvas.current || !sigContainerRef.current) return;
      const containerWidth = sigContainerRef.current.clientWidth || 600;
      const targetHeight = 200;
      const canvas = sigCanvas.current.getCanvas();
      if (!canvas) return;
      canvas.width = containerWidth;
      canvas.height = targetHeight;
      canvas.style.width = '100%';
      canvas.style.height = `${targetHeight}px`;
    };
    resizeCanvasToContainer();
    window.addEventListener('resize', resizeCanvasToContainer);
    return () => window.removeEventListener('resize', resizeCanvasToContainer);
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

    // Ensure a signature is provided (selected or drawn)
    const isCanvasEmpty = !sigCanvas.current || sigCanvas.current.isEmpty();
    const selectedSignature = savedSignatures.find(s => s.id === selectedSignatureId);
    if (!selectedSignature && isCanvasEmpty) {
      alert('Please select an existing e-signature or draw a new one.');
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
    formPayload.append("doctor", state?.dentistDetail?.profile?.user || "");

    // Attach signature as image/png
    try {
      const dataUrl = selectedSignature ? selectedSignature.dataUrl : sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      formPayload.append('signature', blob, 'signature.png');
    } catch (err) {
      console.error('Failed to attach signature:', err);
      alert('Unable to process signature. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendLink}createOrder`, {
        method: 'POST',
        body: formPayload,
      });

      const data = await res.json();
      if (!data?.success) {
        alert("Unable to place order. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = 'https://buy.stripe.com/28EdRag8H4jl2du0tW53O07'; // Redirect to Stripe payment link
    } catch (err) {
      console.error("Order submission error:", err);
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
                    sx={{ mt: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'white' }}
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
                    sx={{ mt: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'white' }}
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
              {/* E-signature Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white', mb: 1 }}>
                  E-signature
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <CustomInputLabel id="signature-select-label" shrink>Select Saved Signature</CustomInputLabel>
                      <CustomSelect
                        labelId="signature-select-label"
                        name="signatureSelect"
                        value={selectedSignatureId}
                        onChange={(e) => setSelectedSignatureId(e.target.value)}
                        label="Select Saved Signature"
                      >
                        <MenuItem value="">Draw new signature</MenuItem>
                        {savedSignatures.map(sig => (
                          <MenuItem key={sig.id} value={sig.id}>{sig.name}</MenuItem>
                        ))}
                      </CustomSelect>
                    </FormControl>
                    {selectedSignatureId && (
                      <Box sx={{ mt: 2, p: 2, border: '1px solid #444', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: 'white', display: 'block', mb: 1 }}>
                          Preview
                        </Typography>
                        <Box component="img" src={savedSignatures.find(s => s.id === selectedSignatureId)?.dataUrl} alt="Selected signature" sx={{ maxWidth: '100%', background: '#1e1e1e' }} />
                        <Box sx={{ mt: 1 }}>
                          <Button variant="text" color="error" onClick={() => setSelectedSignatureId('')}>Choose a different signature</Button>
                        </Box>
                      </Box>
                    )}
                  </Grid>
                  {selectedSignatureId === '' && (
                    <Grid size={{ xs: 6, md: 6 }}>
                      <Box ref={sigContainerRef} sx={{ p: 2, border: '1px solid #444', borderRadius: 1, background: '#1e1e1e' }}>
                        <SignatureCanvas
                          penColor="white"
                          ref={sigCanvas}
                          backgroundColor="rgba(0,0,0,0)"
                          canvasProps={{ style: { width: '100%', height: 200 } }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          <Button variant="outlined" color="error" onClick={() => sigCanvas.current && sigCanvas.current.clear()}>
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                              if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
                                alert('Please draw a signature first.');
                                return;
                              }
                              const name = `Signature ${savedSignatures.length + 1}`;
                              try {
                                let dataUrl = '';
                                try {
                                  dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
                                } catch (innerErr) {
                                  // Fallback to full canvas if trimmed fails
                                  dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png');
                                }
                                const newSig = { id: `${Date.now()}`, name, dataUrl };
                                const updated = [newSig, ...savedSignatures].slice(0, 10);
                                setSavedSignatures(updated);
                                setSelectedSignatureId(newSig.id);
                                if (typeof window !== 'undefined') {
                                  window.localStorage.setItem('bs_saved_signatures', JSON.stringify(updated));
                                }
                              } catch (e) {
                                console.error('Failed to save signature:', e);
                                const message = (e && e.name === 'QuotaExceededError') ? 'Storage is full. Please remove older signatures.' : 'Failed to save signature.';
                                alert(message);
                              }
                            }}
                          >
                            Save to dropdown
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
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
