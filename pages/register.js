"use client";

import React, { useEffect, useState } from "react";
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
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    privacyAccepted: false,
    termsAccepted: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !window.rewardful) return;

    window.rewardful("ready", function () {
      const id = window.Rewardful && window.Rewardful.referral;

      if (id) {
        const hidden = document.getElementById("rewardful_referral");
        if (hidden instanceof HTMLInputElement) {
          hidden.value = id;
        }
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: ["zipCode"].includes(e.target.name)
        ? e.target.value.replace(/\D/g, "")
        : e.target.value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // Validate "Create your account" fields using the same rules as signupValidator.js on the server
  const validateAccountStep = () => {
    // Confirm all required account fields are present
    if (
      !form.fName ||
      !form.lName ||
      !form.userName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill in all required fields.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      return "Email is invalid. Please enter a valid email address.";
    }

    // Enforce the backend's minimum password length of 4 characters
    if (form.password.length < 4) {
      return "Password must be at least 4 characters.";
    }

    // Match the backend rule that password and confirmation must be identical
    if (form.password !== form.confirmPassword) {
      return "Password and confirm password must match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Run the same validations the backend performs before sending the request
    const validationError = validateAccountStep();
    if (validationError) {
      return setErrorMessage(validationError);
    }

    try {
      // Web registrations are always doctor accounts (isDoctor = true)
      const rewardful_referral =
        document.getElementById("rewardful_referral")?.value?.trim();

      const registrationData = {
        ...form,
        isDoctor: true,
        ...(rewardful_referral ? { rewardful_referral } : {}),
      };
      await axios.post(backendLink + "user/signup", registrationData);
      localStorage.setItem("bytesense_order_popup_seen", "true");
      router.push("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("userName")) {
        setErrorMessage("Username already exists. Please try again.");
      } else if (msg.includes("email")) {
        setErrorMessage(msg || "Email already exists. Please try again.");
      } else {
        setErrorMessage("Server error. Please try again later.");
      }
    }
  };
  const steps = ["Create your account", "Practice address"];
  const [step, setStep] = useState(0);

  const handleNext = () => {
    // Block advancing to "Practice address" when account details are invalid
    if (handleContinueDisabled()) {
      return;
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);
  const handleContinueDisabled = () => {
    // Disable the Continue button whenever the shared validator reports an error
    return !!validateAccountStep();
  };
  const handlerSignupDisabled = () => {
    return !(
      form.addressLine1 &&
      form.city &&
      form.state &&
      form.zipCode &&
      form.privacyAccepted &&
      form.termsAccepted
    );
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
      <Box
        className={
          "w-full flex flex-col justify-between items-center h-full overflow-y-auto"
        }
      >
        <Grid
          item
          xs={12}
          md={6}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="start"
          className={"w-full"}
          alignItems="center"
        >
          <Box
            maxWidth={600}
            width="100%"
            mx="auto"
            component="form"
            onSubmit={handleSubmit}
          >
            <input
              type="hidden"
              name="rewardful_referral"
              id="rewardful_referral"
              onChange={handleChange}
            />
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
                    (form.password.length < 4 ||
                      (form.password.length >= 4 &&
                        // form.confirmPassword.length >= 4 &&
                        form.password !== form.confirmPassword))
                  }
                  helperText={
                    form.password.length > 0 &&
                    (form.password.length < 4 ||
                      (form.password.length >= 4 &&
                        // form.confirmPassword.length >= 4 &&
                        form.password !== form.confirmPassword)) &&
                    (form.password.length < 4
                      ? "Password must be at least 4 characters."
                      : "Password and confirm password must match.")
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
                    form.confirmPassword.length > 0 &&
                    (form.confirmPassword.length < 4 ||
                      (form.password.length >= 4 &&
                        form.password !== form.confirmPassword))
                  }
                  helperText={
                    form.confirmPassword.length > 0 &&
                    (form.confirmPassword.length < 4 ||
                      (form.password.length >= 4 &&
                        form.password !== form.confirmPassword)) &&
                    (form.confirmPassword.length < 4
                      ? "Password must be at least 4 characters."
                      : "Password and confirm password must match.")
                  }
                />
                <Typography textAlign="left">
                  <MuiLink
                    href="/login"
                    underline="hover"
                    sx={{
                      color: "error.main",
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                      height: "100%",
                    }}
                  >
                    Already have an account? Sign in
                  </MuiLink>
                </Typography>
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
                  label="Address Line 1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  margin="normal"
                  required
                  placeholder={"Enter address line 1"}
                  wrapClassName={"col-span-2"}
                  error={
                    form.addressLine1.length > 0 &&
                    form.addressLine1.length < 2
                  }
                  helperText={
                    form.addressLine1.length > 0 &&
                    form.addressLine1.length < 2 &&
                    "Address Line 1 must be at least 2 characters."
                  }
                />
                <CustomLabelTextField
                  fullWidth
                  label="Address Line 2"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  margin="normal"
                  placeholder={"Enter address line 2 (optional)"}
                  wrapClassName={"col-span-2"}
                  error={
                      form.addressLine2.length > 0 &&
                      form.addressLine2.length < 2
                  }
                  helperText={
                      form.addressLine2.length > 0 &&
                      form.addressLine2.length < 2 &&
                      "Address Line 1 must be at least 2 characters."
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
                  control={
                    <Checkbox
                      name={"privacyAccepted"}
                      checked={form.privacyAccepted}
                      onChange={handleCheckboxChange}
                      color={"error"}
                      sx={{ color: "white" }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Read{" "}
                      <MuiLink
                        href="https://www.bytesense.ai/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: "error.main" }}
                      >
                        Privacy Policy
                      </MuiLink>
                    </Typography>
                  }
                  className={"col-span-2"}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name={"termsAccepted"}
                      checked={form.termsAccepted}
                      onChange={handleCheckboxChange}
                      color={"error"}
                      sx={{ color: "white" }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "white" }}>
                      Read{" "}
                      <MuiLink
                        href="https://www.bytesense.ai/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: "error.main" }}
                      >
                        Terms of Use
                      </MuiLink>
                    </Typography>
                  }
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
            <Box
              className={
                "w-full flex justify-center items-center flex-row gap-2 py-4"
              }
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
          </Box>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Grid>
        <Box
          className={
            "w-full flex justify-between items-center gap-2 border-t border-[#808080] p-4"
          }
        >
          <div className={"text-xs"}>
            Copyright &copy; 2025 byteSense. All rights reserved.
          </div>
          <div className={"flex items-center gap-4 text-xs"}>
            <a href="https://www.bytesense.ai/privacy-policy" target={"_blank"}>
              Privacy Policy
            </a>
            <a href={"https://www.bytesense.ai/terms-of-use"} target={"_blank"}>
              Terms & Condition
            </a>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
