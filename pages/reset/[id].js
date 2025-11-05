"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert, CircularProgress,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { backendLink } from "../../exports/variable";
import CustomTextField from "../../components/components/CustomTextField";

const ResetPassword = () => {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [userType, setUserType] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTokenUserFrom = async () => {
    try {
      const data = await axios.get(`${backendLink}user/tokenInfo/${params.id}`);
      if (data?.data) {
        setUserType(data?.data);
      }
    } catch (err) {
      console.log("Token info not found");
    }
  };

  useEffect(() => {
    if (params?.id) {
      handleTokenUserFrom();
    }
  }, [params]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return setErrorMessage("Password and confirm password must match.");
    }
    try {
      await axios.put(`${backendLink}user/reset/${params.id}`, form);
      if (userType === "web") {
        router.push("/login");
      } else {
        setForm({
          password: "",
          confirmPassword: "",
        });
        setSuccessMessage(
          "Password reset successfully. Please log in using our mobile app",
        );
      }
      setLoading(false);
    } catch (err) {
      setErrorMessage("Password reset failed. Please try again!");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img
          src="/image.png"
          alt="Logo"
          style={{ width: 160, marginBottom: 16 }}
        />
        <Typography variant="h4" color="error" fontWeight={600}>
          Reset Password
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 3 }}>
          Enter your new password below.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <CustomTextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <CustomTextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          {loading ? (
              <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <CircularProgress />
                <Typography mt={2}>Loading...</Typography>
              </Box>
          ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="error"
            size="large"
            sx={{ mt: 3 }}
          >
            Update Password
          </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
