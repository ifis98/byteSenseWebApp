'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  Avatar,
  Alert,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import moment from 'moment';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [img, setImg] = useState('');
  const [imgPresent, setImgPresent] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef();

  const [form, setForm] = useState({
    userInfo: '',
    firstName: '',
    lastName: '',
    gender: '',
    DOB: '',
    bio: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    unitNo: '',
  });

  const fetchData = async () => {
    try {
      const res = await user.userRequests().getProfile();
      const profile = res.data.profile || {};
      const pic = profile.picture;

      if (pic) {
        setImg(`${backendLink}Uploads/profilePictures/${pic}`);
        setImgPresent(true);
      }

      setForm({
        userInfo: profile.user || '',
        firstName: profile.fName || '',
        lastName: profile.lName || '',
        gender: profile.gender || '',
        DOB: profile.dob || '',
        bio: profile.bio || '',
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zip || '',
        unitNo: profile.address?.unitNo || '',
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      ['firstName', 'lastName'].includes(name) &&
      !/^[a-zA-Z ]*$/.test(value)
    )
      return;
    if (['DOB'].includes(name) && !/^[0-9/]*$/.test(value)) return;
    if (['zipCode', 'unitNo'].includes(name) && !/^[0-9]*$/.test(value))
      return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => inputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split('/')[1];
    const size = file?.size / 1024 / 1024;

    if (size > 3) {
      setUploadError('File size exceeds 3 MB');
      return;
    }
    if (!['png', 'jpeg', 'jpg'].includes(type)) {
      setUploadError('Corrupted or unsupported file type.');
      return;
    }

    setUploadError('');
    setFileName(file.name);
    setImg(URL.createObjectURL(file));
    setImgPresent(true);
  };

  const saveImage = async () => {
    const formData = new FormData();
    formData.append('picture', inputRef.current.files[0]);

    try {
      await user.userRequests().uploadImage(formData);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const saveChanges = async () => {
    const dobValid = moment(form.DOB, 'MM/DD/YYYY', true).isValid();
    if (form.DOB && !dobValid) {
      setUploadError('DOB must be in MM/DD/YYYY format');
      return;
    }

    const data = {
      user: { _id: form.userInfo },
      fName: form.firstName,
      lName: form.lastName,
      bio: form.bio,
      dob: form.DOB,
      gender: form.gender,
      address: {
        street: form.street,
        unitNo: form.unitNo,
        city: form.city,
        state: form.state,
        zip: form.zipCode,
      },
    };

    try {
      await user.userRequests().updateProfile(data);
      setEditMode(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
        Edit Account Info
      </Typography>

      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Loading...</Typography>
        </Box>

      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                Profile Photo
              </Typography>
              <Avatar
                src={imgPresent ? img : '/tempLogo.png'}
                alt="Profile"
                sx={{ width: 100, height: 100, mt: 2 }}
              />
              <input
                ref={inputRef}
                hidden
                id="inputFile"
                type="file"
                onChange={handleFileChange}
              />
              <Box mt={2}>
                {!fileName ? (
                  <Button variant="contained" onClick={handleUploadClick}>
                    Upload Image
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" color="success" onClick={saveImage}>
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      sx={{ ml: 2 }}
                      onClick={fetchData}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
              {fileName && (
                <Typography mt={2} variant="body2">
                  {fileName}
                </Typography>
              )}
              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box display="flex" justifyContent="flex-end">
                {!editMode && (
                  <Button variant="outlined" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Box>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Observer ID"
                    name="userInfo"
                    value={form.userInfo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="DOB (MM/DD/YYYY)"
                    name="DOB"
                    value={form.DOB}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Street"
                    name="street"
                    value={form.street}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={6} sm={1.5}>
                  <TextField
                    label="Zip"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={6} sm={1.5}>
                  <TextField
                    label="Unit"
                    name="unitNo"
                    value={form.unitNo}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box mt={3} display="flex" gap={2}>
                  <Button variant="contained" color="success" onClick={saveChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="warning" onClick={fetchData}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
