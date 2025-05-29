"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import axios from "axios";
import { backendLink } from "../exports/variable";
import CustomLabelTextField from "../components/components/CustomLabelTextField";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");

    try {
      await axios.post(`${backendLink}user/forgotpassword`, { email });
      setFeedbackMessage("Email sent successfully to the account.");
      setSuccess(true);
      setEmail("");
    } catch {
      setFeedbackMessage("Please try again!");
      setSuccess(false);
    }
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
        <Box className={"w-full h-full flex items-center justify-center"}>
          <img
            src="/signin.png"
            alt="login Logo"
            className={"h-3/4 object-contain object-center p-4"}
          />
        </Box>
      </Box>
      <Box className={"w-full p-4 flex justify-center items-center h-full "}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth={600}
          mx="auto"
          className={"w-full"}
        >
          <img
            src="/image.png"
            alt="Logo"
            style={{ width: 160, marginBottom: 16 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 3, color: "white" }}>
            Enter your email and we’ll send you a password reset link.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <CustomLabelTextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              margin="normal"
              placeholder={"Enter your email"}
            />

            {feedbackMessage && (
              <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
                {feedbackMessage}
              </Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="error"
              size="large"
              sx={{ mt: 3 }}
            >
              Send Request
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
