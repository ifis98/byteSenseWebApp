"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { RESET_USER_DETAIL } from "../store/actions/actionTypes/ActionTypes";
import axios from "axios";
import { backendLink } from "../exports/variable";

const WaitingPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          backendLink + "user/approvalStatus",
          {
            headers: {
              Authorization: "Bearer " + token,
              "X-Is-Doctor": "true",
            },
          }
        );

        // If user is approved, redirect to Dashboard
        if (response.data.isAccepted === true) {
          router.push("/");
        }
      } catch (error) {
        // If check fails, stay on waiting page
        console.error("Error checking approval status:", error);
      }
    };

    checkApprovalStatus();
  }, [router]);

  const handleLogout = () => {
    dispatch({ type: RESET_USER_DETAIL });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#b0b0b0",
          }}
        >
          Thank you for registering for byteSense.
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 6,
            color: "#666",
            maxWidth: "600px",
          }}
        >
          We will email you when your account is approved for orders.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={handleProfile}
            sx={{
              minWidth: "150px",
              py: 1.5,
              borderColor: "#f82b36",
              color: "#f82b36",
              "&:hover": {
                borderColor: "#d01e28",
                backgroundColor: "rgba(248, 43, 54, 0.04)",
              },
            }}
          >
            Profile
          </Button>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              minWidth: "150px",
              py: 1.5,
              backgroundColor: "#f82b36",
              "&:hover": {
                backgroundColor: "#d01e28",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WaitingPage;
