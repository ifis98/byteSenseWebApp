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
  CircularProgress,
} from '@mui/material';
import moment from 'moment';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';
import CustomTextField from "../CustomTextField";

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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
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
        addressLine1: profile.address?.street || '',
        addressLine2: profile.address?.unitNo || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        zipCode: profile.address?.zip || '',
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
    if (['zipCode'].includes(name) && !/^[0-9]*$/.test(value))
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
        street: form.addressLine1,
        unitNo: form.addressLine2,
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
      <Typography variant="h5" color="error" fontWeight={600} mb={2}>
        Edit Account Info
      </Typography>

      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Loading...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/*<Grid item xs={12} md={4}>*/}
          <Grid item size={2}>
            <Card sx={{ p: 3, background: '#1d1d1d', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap:2 }}>
              <Typography variant="subtitle1" fontWeight={500} sx={{ color: 'white' }}>
                Profile Photo
              </Typography>
              <Avatar
                src={imgPresent ? img : '/tempLogo.png'}
                alt="Profile"
                sx={{ width: 150, height: 150 }}
              />
              <input
                ref={inputRef}
                hidden
                id="inputFile"
                type="file"
                onChange={handleFileChange}
              />
              <Box>
                {!fileName ? (
                  <Button variant="contained" color="error" onClick={handleUploadClick}>
                    Upload Image
                  </Button>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Button variant="contained" color="error" onClick={saveImage}>
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={fetchData}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
              {fileName && (
                <Typography mt={2} variant="body2" sx={{ color: 'white' }}>
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

          {/*<Grid item xs={12} md={8}>*/}
          <Grid item size={10}>
            <Card sx={{ p: 3, background: '#1d1d1d' }}>
              <Box display="flex" justifyContent="flex-end">
                {!editMode && (
                  <Button variant="outlined" color="error" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Box>

              <Grid container spacing={2} mt={1}>
                <Grid item size={{xs: 12}} >
                  <CustomTextField
                    label="Observer ID"
                    name="userInfo"
                    value={form.userInfo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:6}}>
                  <CustomTextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:6}}>
                  <CustomTextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:6}}>
                  <CustomTextField
                    label="DOB (MM/DD/YYYY)"
                    name="DOB"
                    value={form.DOB}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:6}}>
                  <CustomTextField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12}}>
                  <CustomTextField
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
                <Grid item size={{xs:12}}>
                  <CustomTextField
                    label="Address Line 1"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12}}>
                  <CustomTextField
                      label="Address Line 2"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                  <CustomTextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                  <CustomTextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                  <CustomTextField
                    label="Zip"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>

              </Grid>

              {editMode && (
                <Box mt={3} display="flex" gap={2}>
                  <Button variant="contained" color="error" onClick={saveChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="error" onClick={fetchData}>
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
