"use client";
import * as React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { stripePromise } from "../../../lib/stripe";
import { backendLink } from "../../../exports/variable";
import { user } from "../../../exports/apiCalls";
import CustomTextField from "../CustomTextField";

export default function PreOrderForm() {
  const [quantity, setQuantity] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const res = await user.userRequests().getProfile();
        if (res?.data?.profile) {
          const { fName = "", lName = "" } = res.data.profile;
          setDoctorName(`${fName} ${lName}`.trim());
        }
      } catch (err) {
        console.error("Failed to fetch doctor name:", err);
      }
    };

    fetchDoctorName();
  }, []);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const num = Number(value);
    const isPositiveInteger = Number.isInteger(num) && num > 0;
    setQuantity(value);
    setIsValid(isPositiveInteger);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe failed to initialize.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendLink}createPreorderSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: Number(quantity),
          clientName: doctorName,
        }),
      });

      const data = await res.json();
      if (!data.sessionId) {
        alert("Unable to initiate Stripe Checkout.");
        setLoading(false);
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (result.error) {
        alert(result.error.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        gap: "16px",
        m: 0,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <div style={{ width: "100%", height: "100vh" }}>
          <iframe
            src={"/api/proxy?url=https://bytesense-site.webflow.io/bitely---shop-copy"}
            width="100%"
            height="100%"
          />
        </div>
      </Box>
      <Box sx={{ p: "16px" }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            background: "#1d1d1d",
            border: "1px solid #ffffff4d",
            boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
          }}
        >
          <CardHeader
            title="Pre-Order Now!"
            titleTypographyProps={{ variant: "h5", color: "error" }}
          />
          <Divider sx={{ background: "#ffffff4d" }} />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2} className={"w-full"}>
                <Grid item xs={6}>
                  <CustomTextField
                    required
                    label="Preorder Quantity"
                    name="quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1, step: 1 }}
                    fullWidth
                    sx={{ color: "#fff" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="large"
                    disabled={!isValid || loading}
                    sx={{
                      py: 1.5,
                      px: 6,
                      minWidth: "240px",
                      textTransform: "uppercase",
                      '&.Mui-disabled': {
                        color: 'gray',
                        cursor: 'not-allowed !important',
                        pointerEvents: 'auto !important',
                      },
                    }}
                  >
                    {loading ? "Processing..." : "Submit Preorder"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
