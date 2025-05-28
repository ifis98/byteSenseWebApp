"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

const Verification = () => {
  const router = useRouter();
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        maxWidth={600}
        mx="auto"
        className={"w-full gap-10"}
      >
        <Button variant="text" color="white" onClick={() => router.back()}>
          <KeyboardBackspaceOutlinedIcon sx={{ color: "white", mr: 2 }} />
          Back
        </Button>
        <Box
          className={"w-full"}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "left", width: "100%" }}
          >
            Verify your Cloud Account
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "white", width: "100%", textAlign: "left" }}
          >
            Verification link sent! Check your email and click the link to
            verify your account.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 2,
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <Button
            type="submit"
            variant="text"
            color="white"
            className={"!normal-case"}
          >
            Didn&#39;t receive the email?
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="error"
            size="large"
          >
            Resend Verification Email
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
export default Verification;
