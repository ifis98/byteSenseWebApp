"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import moment from "moment";
import { backendLink } from "../../../exports/variable";
import { user } from "../../../exports/apiCalls";
import CustomTextField from "../CustomTextField";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [img, setImg] = useState("");
  const [imgPresent, setImgPresent] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef();

  const [form, setForm] = useState({
    userInfo: "",
    firstName: "",
    lastName: "",
    gender: "",
    DOB: "",
    bio: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    // Practice Information - Contact Information
    preferredPhoneNumber: "",
    companyName: "",
    preferredContactMethodPhone: false,
    preferredContactMethodEmail: false,
    primaryContactName: "",
    primaryContactRole: "",
    primaryContactPhoneNumber: "",
    officeEmail: "",
    // Practice Information - Shipping Information
    attentionRecipientName: "",
    deliveryPhoneNumber: "",
    receivingPreference: "",
    preferredNotificationMethod: "",
    additionalShippingInstructions: "",
    // Practice Information - Operational Information
    estimatedOrdersPerMonth: "",
    dentalLicenseNumber: "",
    additionalOperationalInstructions: "",
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
        userInfo: profile.user || "",
        firstName: profile.fName || "",
        lastName: profile.lName || "",
        gender: profile.gender || "",
        DOB: profile.dob || "",
        bio: profile.bio || "",
        addressLine1:
          profile.address?.addressLine1 || profile.address?.street || "",
        addressLine2:
          profile.address?.addressLine2 || profile.address?.unitNo || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        zipCode: profile.address?.zip || "",
        // Practice Information - Contact Information
        preferredPhoneNumber: profile.preferredPhoneNumber || "",
        companyName: profile.companyName || "",
        preferredContactMethodPhone:
          profile.preferredContactMethodPhone || false,
        preferredContactMethodEmail:
          profile.preferredContactMethodEmail || false,
        primaryContactName: profile.primaryContactName || "",
        primaryContactRole: profile.primaryContactRole || "",
        primaryContactPhoneNumber: profile.primaryContactPhoneNumber || "",
        officeEmail: profile.officeEmail || "",
        // Practice Information - Shipping Information
        attentionRecipientName: profile.attentionRecipientName || "",
        deliveryPhoneNumber: profile.deliveryPhoneNumber || "",
        receivingPreference: profile.receivingPreference || "",
        preferredNotificationMethod: profile.preferredNotificationMethod || "",
        additionalShippingInstructions:
          profile.additionalShippingInstructions || "",
        // Practice Information - Operational Information
        estimatedOrdersPerMonth: profile.estimatedOrdersPerMonth || "",
        dentalLicenseNumber: profile.dentalLicenseNumber || "",
        additionalOperationalInstructions:
          profile.additionalOperationalInstructions || "",
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
    if (["firstName", "lastName"].includes(name) && !/^[a-zA-Z ]*$/.test(value))
      return;
    if (["DOB"].includes(name) && !/^[0-9/]*$/.test(value)) return;
    if (["zipCode"].includes(name) && !/^[0-9]*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleUploadClick = () => inputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split("/")[1];
    const size = file?.size / 1024 / 1024;

    if (size > 3) {
      setUploadError("File size exceeds 3 MB");
      return;
    }
    if (!["png", "jpeg", "jpg"].includes(type)) {
      setUploadError("Corrupted or unsupported file type.");
      return;
    }

    setUploadError("");
    setFileName(file.name);
    setImg(URL.createObjectURL(file));
    setImgPresent(true);
  };

  const saveImage = async () => {
    const formData = new FormData();
    formData.append("picture", inputRef.current.files[0]);

    try {
      await user.userRequests().uploadImage(formData);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const saveChanges = async () => {
    const dobValid = moment(form.DOB, "MM/DD/YYYY", true).isValid();
    if (form.DOB && !dobValid) {
      setUploadError("DOB must be in MM/DD/YYYY format");
      return;
    }

    // Validate that at least one preferred contact method is selected
    if (
      !form.preferredContactMethodPhone &&
      !form.preferredContactMethodEmail
    ) {
      setUploadError("Please select at least one preferred contact method");
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
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        zip: form.zipCode,
      },
      // Practice Information - Contact Information
      preferredPhoneNumber: form.preferredPhoneNumber,
      companyName: form.companyName,
      preferredContactMethodPhone: form.preferredContactMethodPhone,
      preferredContactMethodEmail: form.preferredContactMethodEmail,
      primaryContactName: form.primaryContactName,
      primaryContactRole: form.primaryContactRole,
      primaryContactPhoneNumber: form.primaryContactPhoneNumber,
      officeEmail: form.officeEmail,
      // Practice Information - Shipping Information
      attentionRecipientName: form.attentionRecipientName,
      deliveryPhoneNumber: form.deliveryPhoneNumber,
      receivingPreference: form.receivingPreference,
      preferredNotificationMethod: form.preferredNotificationMethod,
      additionalShippingInstructions: form.additionalShippingInstructions,
      // Practice Information - Operational Information
      estimatedOrdersPerMonth: form.estimatedOrdersPerMonth,
      dentalLicenseNumber: form.dentalLicenseNumber,
      additionalOperationalInstructions: form.additionalOperationalInstructions,
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
            <Card
              sx={{
                p: 3,
                background: "#1d1d1d",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ color: "white" }}
              >
                Profile Photo
              </Typography>
              <Avatar
                src={imgPresent ? img : "/tempLogo.png"}
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
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleUploadClick}
                  >
                    Upload Image
                  </Button>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={saveImage}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        fetchData();
                        setFileName("");
                        setImgPresent(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
              {fileName && (
                <Typography mt={2} variant="body2" sx={{ color: "white" }}>
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
            <Card sx={{ p: 3, background: "#1d1d1d" }}>
              <Box display="flex" justifyContent="flex-end">
                {!editMode && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Grid container spacing={2} mt={1}>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Observer ID"
                    name="userInfo"
                    value={form.userInfo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="DOB (MM/DD/YYYY)"
                    name="DOB"
                    value={form.DOB}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
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
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Shipping Address Line 1"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Shipping Address Line 2"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <CustomTextField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <CustomTextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <CustomTextField
                    label="Zip"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>

                {/* Practice Information - Contact Information Section */}
                <Grid item size={{ xs: 12 }}>
                  <Box sx={{ borderBottom: "1px solid white", mb: 2, mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Contact Information
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Preferred Phone Number"
                    name="preferredPhoneNumber"
                    value={form.preferredPhoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: "white", mb: 0.5 }}>
                    Preferred Contact Method{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#b0b0b0", mb: 1, display: "block" }}
                  >
                    Must select at least one
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="preferredContactMethodPhone"
                        checked={form.preferredContactMethodPhone}
                        onChange={handleCheckboxChange}
                        disabled={!editMode}
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "gray",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 28,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "white" }}>
                        Text
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="preferredContactMethodEmail"
                        checked={form.preferredContactMethodEmail}
                        onChange={handleCheckboxChange}
                        disabled={!editMode}
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "gray",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 28,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "white" }}>
                        Email
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Primary Contact for Orders and Onboarding Name"
                    name="primaryContactName"
                    value={form.primaryContactName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Primary Contact Phone Number"
                    name="primaryContactPhoneNumber"
                    value={form.primaryContactPhoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Primary Contact Role (Owner / Office Manager / Treatment Coordinator / etc.)"
                    name="primaryContactRole"
                    value={form.primaryContactRole}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Office Email"
                    name="officeEmail"
                    type="email"
                    value={form.officeEmail}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>

                {/* Practice Information - Shipping Information Section */}
                <Grid item size={{ xs: 12 }}>
                  <Box sx={{ borderBottom: "1px solid white", mb: 2, mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Shipping Information
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Attention/Recipient Name"
                    name="attentionRecipientName"
                    value={form.attentionRecipientName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Phone Number for Delivery Issues"
                    name="deliveryPhoneNumber"
                    value={form.deliveryPhoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Receiving Preference (Front Desk / Back Office / Lab / etc.)"
                    name="receivingPreference"
                    value={form.receivingPreference}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel
                      sx={{
                        color: "white",
                        "&.Mui-disabled": {
                          color: "#b0b0b0",
                        },
                      }}
                    >
                      Preferred Notification Method of Item Shipped
                    </InputLabel>
                    <Select
                      name="preferredNotificationMethod"
                      value={form.preferredNotificationMethod}
                      onChange={handleInputChange}
                      label="Preferred Notification Method of Item Shipped"
                      sx={{
                        color: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                        // Disabled state styling to match CustomTextField
                        "&.Mui-disabled": {
                          backgroundColor: "#242424",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaaaaa",
                          },
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          color: "#888888",
                          WebkitTextFillColor: "#888888",
                        },
                      }}
                    >
                      <MenuItem value="Email">Email</MenuItem>
                      <MenuItem value="Text">Text</MenuItem>
                      <MenuItem value="None">
                        None (You can still track your orders on this web
                        application)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Additional Shipping Instructions (Optional)"
                    name="additionalShippingInstructions"
                    value={form.additionalShippingInstructions}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!editMode}
                  />
                </Grid>

                {/* Practice Information - Operational Information Section */}
                <Grid item size={{ xs: 12 }}>
                  <Box sx={{ borderBottom: "1px solid white", mb: 2, mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Operational Information
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel
                      sx={{
                        color: "white",
                        "&.Mui-disabled": {
                          color: "#b0b0b0",
                        },
                      }}
                    >
                      Estimated Orders per Month
                    </InputLabel>
                    <Select
                      name="estimatedOrdersPerMonth"
                      value={form.estimatedOrdersPerMonth}
                      onChange={handleInputChange}
                      label="Estimated Orders per Month"
                      sx={{
                        color: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                        // Disabled state styling to match CustomTextField
                        "&.Mui-disabled": {
                          backgroundColor: "#242424",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaaaaa",
                          },
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          color: "#888888",
                          WebkitTextFillColor: "#888888",
                        },
                      }}
                    >
                      <MenuItem value="1-2">1-2</MenuItem>
                      <MenuItem value="3-5">3-5</MenuItem>
                      <MenuItem value="6-9">6-9</MenuItem>
                      <MenuItem value="10+">10+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Dental License Number"
                    name="dentalLicenseNumber"
                    value={form.dentalLicenseNumber}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <CustomTextField
                    label="Additional Operational Instructions"
                    name="additionalOperationalInstructions"
                    value={form.additionalOperationalInstructions}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={saveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      fetchData();
                      setEditMode(false);
                    }}
                  >
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
