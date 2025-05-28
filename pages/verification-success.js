"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const VerificationSuccess = () => {
  const router = useRouter();
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        maxWidth={400}
        mx="auto"
        className={"w-full gap-10"}
      >
        <Typography
          variant="h4"
          sx={{ color: "white", textAlign: "left", width: "100%" }}
        >
          Verification Successful!!
        </Typography>
        <Box
          className={"w-full"}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CheckCircleOutlineOutlinedIcon
            sx={{ color: "white", fontSize: 150, textAlign: "center" }}
          />
        </Box>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="error"
          size="large"
          onClick={() => router.push("/login")}
        >
          Back To Login
        </Button>
      </Box>
    </Container>
  );
};
export default VerificationSuccess;
