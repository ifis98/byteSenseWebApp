"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { backendLink } from "../exports/variable";
import CustomLabelTextField from "../components/components/CustomLabelTextField";

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    isDoctor: true,
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    unitNo: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: ["unitNo", "zipCode"].includes(e.target.name)
        ? e.target.value.replace(/\D/g, "")
        : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      return setErrorMessage("Password and confirm password must match.");
    }

    try {
      await axios.post(backendLink + "user/signup", form);
      router.push("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("userName")) {
        setErrorMessage("Username already exists. Please try again.");
      } else if (msg.includes("email")) {
        setErrorMessage("Email already exists. Please try again.");
      } else {
        setErrorMessage("Server error. Please try again later.");
      }
    }
  };
  const steps = ["Create your account", "Practice address"];
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleContinueDisabled = () => {
    if (
      form.fName &&
      form.lName &&
      form.userName &&
      form.email &&
      form.password &&
      form.confirmPassword
    ) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (form.password !== form.confirmPassword) {
        return true;
      } else return !regex.test(form.email);
    } else {
      return true;
    }
  };
  const handlerSignupDisabled = () => {
    return !(form.streetAddress && form.city && form.state && form.zipCode);
  };

  return (
    <Box
      className={"flex flex-row justify-center items-center w-full"}
      sx={{ height: "100vh", width: "100%" }}
      style={{ backgroundColor: "#1d1d1d" }}
    >
      <Box
        className={
          "w-4/5 h-full flex items-center justify-center hidden md:block"
        }
        sx={{
          background: "#000000",
          backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.95) 20%, rgb(255 32 3 / 60%) 100%)",
        }}
      >
        <Box className={"w-full h-full flex items-end justify-center"}>
          <img
            src="/signup.png"
            alt="Sign Up Logo"
            className={"h-4/5 object-contain object-center"}
          />
        </Box>
      </Box>
      <Box className={"w-full flex justify-center items-center h-full"}>
        <Grid
          item
          xs={12}
          md={6}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          className={"w-full h-full gap-2 overflow-y-auto"}
          alignItems="center"
        >
          <Box
            maxWidth={600}
            width="100%"
            mx="auto"
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <img
                src="/image.png"
                alt="Logo"
                style={{ width: 160, marginBottom: 16 }}
              />
              {steps[step]}
            </Typography>
            {step === 1 && (
              <Typography
                variant="subtitle1"
                style={{ textAlign: "center", color: "white" }}
              >
                This is where your orders will be shipped,
                <br />
                this information can be changed in your profile settings
              </Typography>
            )}

            {step === 0 && (
              <Box className={"grid grid-cols-2 gap-4 mt-4"}>
                <CustomLabelTextField
                  fullWidth
                  label="First Name"
                  name="fName"
                  value={form.fName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your first name"}
                  error={form.fName.length > 0 && form.fName.length < 2}
                  helperText={
                    form.fName.length > 0 &&
                    form.fName.length < 2 &&
                    "First Name must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Last Name"
                  name="lName"
                  value={form.lName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your last name"}
                  error={form.lName.length > 0 && form.lName.length < 2}
                  helperText={
                    form.lName.length > 0 &&
                    form.lName.length < 2 &&
                    "Last Name must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Username"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your username"}
                  wrapClassName={"col-span-2"}
                  error={form.userName.length > 0 && form.userName.length < 2}
                  helperText={
                    form.userName.length > 0 &&
                    form.userName.length < 2 &&
                    "Username must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your email"}
                  wrapClassName={"col-span-2"}
                  error={
                    form.email.length > 0 &&
                    !form.email.match(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    )
                  }
                  helperText={
                    form.email.length > 0 &&
                    !form.email.match(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ) &&
                    "Email is invalid. Please enter a valid email address."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your password"}
                  error={
                    form.password.length > 0 &&
                    form.password !== form.confirmPassword
                  }
                  helperText={
                    form.password.length > 0 &&
                    form.password !== form.confirmPassword &&
                    "Password and confirm password must match."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Confirm your password"}
                  error={
                    form.password.length > 0 &&
                    form.password !== form.confirmPassword
                  }
                  helperText={
                    form.password.length > 0 &&
                    form.password !== form.confirmPassword &&
                    "Password and confirm password must match."
                  }
                />
                <Button
                  // type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color="error"
                  className={"col-span-2"}
                  onClick={handleNext}
                  disabled={handleContinueDisabled()}
                  sx={{
                    "&.Mui-disabled": {
                      color: "gray",
                      cursor: "not-allowed !important",
                      pointerEvents: "auto !important",
                    },
                  }}
                >
                  Continue →
                </Button>
              </Box>
            )}

            {step === 1 && (
              <Box className={"grid grid-cols-2 gap-4 mt-4"}>
                <CustomLabelTextField
                  fullWidth
                  label="Unit Number"
                  name="unitNo"
                  value={form.unitNo}
                  onChange={handleChange}
                  margin="normal"
                  placeholder={"Enter your unit number"}
                  wrapClassName={"col-span-2"}
                />
                <CustomLabelTextField
                  fullWidth
                  label="Street Address"
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline={true}
                  rows={2}
                  placeholder={"Enter your street address"}
                  wrapClassName={"col-span-2"}
                  error={
                    form.streetAddress.length > 0 &&
                    form.streetAddress.length < 2
                  }
                  helperText={
                    form.streetAddress.length > 0 &&
                    form.streetAddress.length < 2 &&
                    "Street Address must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your city"}
                  error={form.city.length > 0 && form.city.length < 2}
                  helperText={
                    form.city.length > 0 &&
                    form.city.length < 2 &&
                    "City must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your state"}
                  error={form.state.length > 0 && form.state.length < 2}
                  helperText={
                    form.state.length > 0 &&
                    form.state.length < 2 &&
                    "State must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter your zip code"}
                  wrapClassName={"col-span-2"}
                  error={form.zipCode.length > 0 && form.zipCode.length < 5}
                  helperText={
                    form.zipCode.length > 0 &&
                    form.zipCode.length < 5 &&
                    "Zip Code must be at least 5 characters."
                  }
                />

                <FormControlLabel
                  control={<Checkbox color={"error"} sx={{ color: "white" }} />}
                  label="Read Private Policy"
                  className={"col-span-2"}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={2}
                  flexDirection={"row"}
                  className={"col-span-2"}
                  gap={2}
                >
                  <Button
                    onClick={handleBack}
                    variant={"text"}
                    size="large"
                    color="error"
                  >
                    ← Back
                  </Button>
                  <Typography textAlign="center">
                    <MuiLink
                      href="/login"
                      underline="hover"
                      sx={{
                        color: "error.main",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      Already have an account? Sign in
                    </MuiLink>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="error"
                    disabled={handlerSignupDisabled()}
                    sx={{
                      "&.Mui-disabled": {
                        color: "gray",
                        cursor: "not-allowed !important",
                        pointerEvents: "auto !important",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box
            className={"flex justify-center items-center flex-row gap-2"}
            mt={4}
            mb={4}
          >
            {steps?.map((item, index) => (
              <span
                key={index}
                className={`${index === step ? "w-[30px] bg-red-500" : "w-[10px] bg-white"} h-[10px] rounded-full ${handleContinueDisabled() ? "cursor-not-allowed" : "cursor-pointer"} `}
                onClick={() => {
                  if (!handleContinueDisabled()) {
                    setStep(index);
                  }
                }}
              />
            ))}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
