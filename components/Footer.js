import React from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        borderTop: "1px solid #5f5f5f",
        px: 2,
        backgroundColor: "#242424",
        mt: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          py: 3,
        }}
      >
        {/* Left side - Copyright */}
        <Typography
          variant="body2"
          sx={{
            color: "#ffffff",
            fontSize: "14px",
          }}
        >
          Copyright © 2025 byteSense. All rights reserved.
        </Typography>

        {/* Right side - Links */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
          }}
        >
          <MuiLink
            href="https://www.bytesense.ai/privacy-policy"
            underline="none"
            target={"_blank"}
            sx={{
              color: "#ffffff",
              fontSize: "14px",
              "&:hover": {
                color: "#cccccc",
              },
            }}
          >
            Privacy Policy
          </MuiLink>
          <MuiLink
            href="https://www.bytesense.ai/terms-of-use"
            underline="none"
            target={"_blank"}
            sx={{
              color: "#ffffff",
              fontSize: "14px",
              "&:hover": {
                color: "#cccccc",
              },
            }}
          >
            Terms & Conditions
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
