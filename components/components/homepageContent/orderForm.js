"use client";
import * as React from "react";
import { backendLink } from "../../../exports/variable";
import { doctor, user } from "../../../exports/apiCalls";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useState, useEffect, useRef } from "react";
import CustomTextField from "../CustomTextField";
import { CustomInputLabel, CustomSelect } from "../CustomSelect";
import { useSelector } from "react-redux";
import SignatureCanvas from "react-signature-canvas";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    caseName: "",
    arch: "Upper",
    type: "Flat Plane",
    maxUndercut: "",
    passiveSpacer: "",
    upperScan: null,
    lowerScan: null,
    biteScans: null,
    instructions: "",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [currentStep, setCurrentStep] = useState("form"); // "form" or "review"
  const sigCanvas = useRef(null);
  const sigContainerRef = useRef(null);

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
  });

  // E-signature state
  // const [savedSignatures, setSavedSignatures] = useState([]); // Persisted signatures in the format: { id, name, dataUrl }
  // const [selectedSignatureId, setSelectedSignatureId] = useState("");

  // Tracks whether the introductory popup should display for first-time users
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);

  const state = useSelector((state) => state.page);

  useEffect(() => {
    if (localStorage.getItem("bytesense_order_popup_seen") === "true") {
      setShowFirstTimePopup(true);
    }
    const fetchDoctorData = async () => {
      try {
        const res = await user.userRequests().getProfile();
        if (res?.data?.profile) {
          const { fName = "", lName = "", address } = res.data.profile;
          setDoctorName(`${fName} ${lName}`.trim());

          // Prefill shipping address from backend
          // Handle both addressLine1/addressLine2 and street/unitNo field names
          const addressLine1 = address?.addressLine1 || address?.street || "";
          const addressLine2 = address?.addressLine2 || address?.unitNo || "";
          const zip = address?.zip || address?.zipCode || "";

          const shippingData = {
            addressLine1: addressLine1,
            addressLine2: addressLine2,
            city: address?.city || "",
            state: address?.state || "",
            zip: zip,
          };

          setShippingAddress(shippingData);
        }
      } catch (err) {
        console.error("Failed to fetch doctor data:", err);
      }
    };

    fetchDoctorData();
    // Restore any previously saved signatures from localStorage
    // try {
    //   const raw =
    //     typeof window !== "undefined"
    //       ? window.localStorage.getItem("bs_saved_signatures")
    //       : null;
    //   if (raw) {
    //     const parsed = JSON.parse(raw);
    //     if (Array.isArray(parsed)) setSavedSignatures(parsed);
    //   }
    // } catch (e) {
    //   console.warn("Unable to load saved signatures");
    // }
    // Resize the signature canvas so it always matches the container width
    const resizeCanvasToContainer = () => {
      if (!sigCanvas.current || !sigContainerRef.current) return;
      const containerWidth = sigContainerRef.current.clientWidth || 600;
      const targetHeight = 200;
      const canvas = sigCanvas.current.getCanvas();
      if (!canvas) return;
      canvas.width = containerWidth;
      canvas.height = targetHeight;
      canvas.style.width = "100%";
      canvas.style.height = `${targetHeight}px`;
    };
    resizeCanvasToContainer();
    window.addEventListener("resize", resizeCanvasToContainer);
    return () => window.removeEventListener("resize", resizeCanvasToContainer);
  }, []);

  // Automatically close the ClickUp "first time" popup after the form is submitted
  // ClickUp's embed script posts messages to the parent window; we listen for those
  // and close the dialog when we receive a message from a ClickUp origin.
  // useEffect(() => {
  //   if (!showFirstTimePopup) return;
  //
  //   const handleMessage = (event) => {
  //     if (
  //       typeof event.origin === "string" &&
  //       event.origin.includes("clickup.com")
  //     ) {
  //       setShowFirstTimePopup(false);
  //       if (typeof window !== "undefined") {
  //         window.localStorage.setItem("bytesense_order_popup_seen", "false");
  //       }
  //     }
  //   };
  //
  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, [showFirstTimePopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!formData.caseName) {
      alert("Please complete all required fields.");
      return;
    }

    if (!formData.upperScan || !formData.lowerScan) {
      alert("Please upload both upper and lower scan STLs.");
      return;
    }

    if (!formData.license.trim()) {
      alert("Please enter your license number.");
      return;
    }

    // Require either a stored signature or a newly drawn one before proceeding
    // const isCanvasEmpty = !sigCanvas.current || sigCanvas.current.isEmpty();
    // const selectedSignature = savedSignatures.find(
    //   (s) => s.id === selectedSignatureId,
    // );
    // if (!selectedSignature && isCanvasEmpty) {
    //   alert("Please select an existing e-signature or draw a new one.");
    //   return;
    // }

    setCurrentStep("review");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.caseName || !formData.maxUndercut || !formData.passiveSpacer) {
    //   alert("Please complete all required fields.");
    //   return;
    // }

    if (!formData.caseName) {
      alert("Please complete all required fields.");
      return;
    }

    if (!formData.upperScan || !formData.lowerScan) {
      alert("Please upload both upper and lower scan STLs.");
      return;
    }

    // Require either a stored signature or a newly drawn one before submission
    // const isCanvasEmpty = !sigCanvas.current || sigCanvas.current.isEmpty();
    // const selectedSignature = savedSignatures.find(
    //   (s) => s.id === selectedSignatureId,
    // );
    // if (!selectedSignature && isCanvasEmpty) {
    //   alert("Please select an existing e-signature or draw a new one.");
    //   return;
    // }

    // Validate shipping address
    if (
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip
    ) {
      alert("Please complete all required shipping address fields.");
      return;
    }

    setLoading(true);

    const payload = {
      caseName: formData.caseName,
      arch: formData.arch,
      type: formData.type,
      // maxUndercut: formData.maxUndercut,
      // passiveSpacer: formData.passiveSpacer,
      upperScan: formData.upperScan,
      lowerScan: formData.lowerScan,
      clientName: doctorName,
      doctor: state?.dentistDetail?.profile?.user || "",
      biteScans: formData.biteScans,
      instructions: formData.instructions,
      license: formData.license,
    };

    // try {
    //   let blob;
    //
    //   if (selectedSignature) {
    //     const dataUrl = selectedSignature.dataUrl;
    //
    //     if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    //       throw new Error("Invalid signature data URL");
    //     }
    //
    //     const response = await fetch(dataUrl);
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch signature data");
    //     }
    //     blob = await response.blob();
    //   } else {
    //   const canvas = sigCanvas.current.getTrimmedCanvas();
    //   blob = await new Promise((resolve, reject) => {
    //     canvas.toBlob(
    //       (blob) => {
    //         if (blob) {
    //           resolve(blob);
    //         } else {
    //           reject(new Error("Failed to convert canvas to blob"));
    //         }
    //       },
    //       "image/png",
    //       0.9,
    //     );
    //   });
    //   }
    //   blob.name = "signature.png";
    //   payload.signature = blob;
    // } catch (err) {
    //   console.error("Failed to attach signature:", err);
    //   alert("Unable to process signature. Please try again.");
    //   setLoading(false);
    //   return;
    // }
    // Build FormData including files and signature
    const formPayload = new FormData();
    formPayload.append("caseName", String(payload.caseName));
    formPayload.append("arch", String(payload.arch));
    formPayload.append("type", String(payload.type));
    // formPayload.append("maxUndercut", String(payload.maxUndercut));
    // formPayload.append("passiveSpacer", String(payload.passiveSpacer));
    formPayload.append("clientName", String(payload.clientName));
    formPayload.append("doctor", String(payload.doctor));
    formPayload.append("license", String(payload.license));
    if (payload.instructions)
      formPayload.append("instructions", String(payload.instructions));

    formPayload.append("addressLine1", String(shippingAddress.addressLine1));
    if (shippingAddress.addressLine2)
      formPayload.append("addressLine2", String(shippingAddress.addressLine2));
    formPayload.append("city", String(shippingAddress.city));
    formPayload.append("state", String(shippingAddress.state));
    formPayload.append("zip", String(shippingAddress.zip));
    // Files
    if (payload.upperScan) {
      formPayload.append(
        "upperScan",
        payload.upperScan,
        payload.upperScan?.name || "upper.stl",
      );
    }
    if (payload.lowerScan) {
      formPayload.append(
        "lowerScan",
        payload.lowerScan,
        payload.lowerScan?.name || "lower.stl",
      );
    }
    if (payload.biteScans) {
      formPayload.append(
        "biteScans",
        payload.biteScans,
        payload.biteScans?.name || "bite.stl",
      );
    }
    // Signature
    // formPayload.append(
    //   "signature",
    //   payload.signature,
    //   payload.signature?.name || "signature.png",
    // );

    console.log("formPayload: ", formPayload);

    try {
      doctor
        // .doctorRequests()
        // .addOrder(payload)
        // .then((res) => {
        //   // window.location.href = 'https://buy.stripe.com/3cI9AU7Cb9DFcS8gsU53O08'; // Redirect to Stripe payment link
        // })
        // .catch((e) => {
        //   alert("Unable to place order. Please try again.");
        //   setLoading(false);
        // });
        .doctorRequests()
        .addOrder(formPayload)
        .then((res) => {
          window.location.href =
            "https://buy.stripe.com/3cI9AU7Cb9DFcS8gsU53O08";
        })
        .catch((e) => {
          alert("Unable to place order. Please try again.");
          setLoading(false);
        });
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const getFileName = (file, maxLength = 20) => {
    if (!file) return "";
    const name = file.name;
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const base = name.slice(0, name.length - extension.length - 1);
    return `${base.slice(0, maxLength - extension.length - 4)}....${extension}`;
  };

  const handleFileDownload = (file, fileName) => {
    if (!file) return;
    
    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const renderFormSection = () => {
    return (
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Card elevation={3} sx={{ borderRadius: 3, background: "#242424" }}>
          <CardHeader
            title="Order Form"
            titleTypographyProps={{ variant: "h5", color: "error" }}
            action={
              <Tooltip title="Show first-time user guide">
                <IconButton
                  onClick={() => setShowFirstTimePopup(true)}
                  sx={{ color: "white" }}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            }
          />
          <Divider />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    required
                    label="Case Name"
                    name="caseName"
                    value={formData.caseName}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth required>
                    <CustomInputLabel id="arch-label" shrink>
                      Arch
                    </CustomInputLabel>
                    <CustomSelect
                      labelId="arch-label"
                      name="arch"
                      value={formData.arch}
                      onChange={handleChange}
                      label="Arch"
                    >
                      <MenuItem value="Upper">Upper</MenuItem>
                    </CustomSelect>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth required>
                    <CustomInputLabel id="type-label" shrink>
                      Type
                    </CustomInputLabel>
                    <CustomSelect
                      labelId="type-label"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label="Type"
                    >
                      <MenuItem value="Flat Plane">Flat Plane</MenuItem>
                    </CustomSelect>
                  </FormControl>
                </Grid>

                {/*<Grid size={{ xs: 6 }}>*/}
                {/*  <CustomTextField*/}
                {/*    required*/}
                {/*    label="Maximum Undercut (mm)"*/}
                {/*    name="maxUndercut"*/}
                {/*    type="number"*/}
                {/*    inputProps={{ step: "0.01" }}*/}
                {/*    value={formData.maxUndercut}*/}
                {/*    onChange={handleChange}*/}
                {/*    fullWidth*/}
                {/*  />*/}
                {/*</Grid>*/}

                {/*<Grid size={{ xs: 6 }}>*/}
                {/*  <CustomTextField*/}
                {/*    required*/}
                {/*    label="Passive Spacer (mm)"*/}
                {/*    name="passiveSpacer"*/}
                {/*    type="number"*/}
                {/*    inputProps={{ step: "0.01" }}*/}
                {/*    value={formData.passiveSpacer}*/}
                {/*    onChange={handleChange}*/}
                {/*    fullWidth*/}
                {/*  />*/}
                {/*</Grid>*/}

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, color: "white" }}
                  >
                    Upload Scans
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ color: "white" }}
                  >
                    Please upload your scan STLs oriented at the bite opening
                    where the nightguard should be created.
                  </Typography>
                </Grid>

                {/*<Grid size={{ xs: 12 }}>*/}
                {/*<Typography*/}
                {/*  variant="subtitle1"*/}
                {/*  sx={{ fontWeight: 500, color: "white" }}*/}
                {/*>*/}
                {/*  Option 1*/}
                {/*</Typography>*/}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ paddingY: "8px" }}>
                  <Button
                    component="label"
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ height: 56, textTransform: "none" }}
                  >
                    Upload Upper Scan STL (Required)
                    <input
                      hidden
                      type="file"
                      accept=".stl"
                      name="upperScan"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.upperScan && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "white",
                      }}
                    >
                      Selected: {getFileName(formData.upperScan, 30)}
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} sx={{ paddingY: "8px" }}>
                  <Button
                    component="label"
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ height: 56, textTransform: "none" }}
                  >
                    Upload Lower Scan STL (Required)
                    <input
                      hidden
                      type="file"
                      accept=".stl"
                      name="lowerScan"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.lowerScan && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "white",
                      }}
                    >
                      Selected: {getFileName(formData.lowerScan, 30)}
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ paddingY: "8px" }}>
                  <Button
                    component="label"
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ height: 56, textTransform: "none" }}
                  >
                    Upload Bite Scans
                    <input
                      hidden
                      type="file"
                      accept=".stl"
                      name="biteScans"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.biteScans && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "white",
                      }}
                    >
                      Selected: {getFileName(formData.biteScans, 30)}
                    </Typography>
                  )}
                </Grid>
                {/*</Grid>*/}
                {/*<Grid size={{ xs: 6 }}>*/}
                {/*  <Typography*/}
                {/*    variant="subtitle1"*/}
                {/*    sx={{ fontWeight: 500, color: "white" }}*/}
                {/*  >*/}
                {/*    Option 2 : Use your Digital Scanning Platform*/}
                {/*  </Typography>*/}
                {/*  <List dense sx={{ color: "white", listStyle: "none", pl: 0 }}>*/}
                {/*    {[*/}
                {/*      "3Shape",*/}
                {/*      "iTero",*/}
                {/*      "Sirona",*/}
                {/*      "Carestream / Dexis",*/}
                {/*      "EasyRx",*/}
                {/*    ].map((platform) => (*/}
                {/*      <ListItem key={platform} sx={{ py: 0.5 }}>*/}
                {/*        <Typography sx={{ fontSize: "16px !important" }}>*/}
                {/*          &#9679;&nbsp;*/}
                {/*        </Typography>*/}
                {/*        <ListItemText*/}
                {/*          primary={platform}*/}
                {/*          primaryTypographyProps={{ color: "white" }}*/}
                {/*        />*/}
                {/*      </ListItem>*/}
                {/*    ))}*/}
                {/*  </List>*/}
                {/*</Grid>*/}

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    label="Additional Instructions"
                    name="instructions"
                    multiline
                    rows={4}
                    value={formData.instructions}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                {/* E-signature Section */}
                {/*<Grid size={{ xs: 12 }}>*/}
                {/*  <Typography*/}
                {/*    variant="subtitle1"*/}
                {/*    sx={{ fontWeight: 500, color: "white", mb: 1 }}*/}
                {/*  >*/}
                {/*    E-signature*/}
                {/*  </Typography>*/}
                {/*  <Grid container spacing={2}>*/}
                {/*    <Grid size={{ xs: 12 }}>*/}
                {/*      <FormControl fullWidth>*/}
                {/*        <CustomInputLabel id="signature-select-label" shrink>*/}
                {/*          Select Saved Signature*/}
                {/*        </CustomInputLabel>*/}
                {/*        <CustomSelect*/}
                {/*          labelId="signature-select-label"*/}
                {/*          name="signatureSelect"*/}
                {/*          value={selectedSignatureId}*/}
                {/*          onChange={(e) =>*/}
                {/*            setSelectedSignatureId(e.target.value)*/}
                {/*          }*/}
                {/*          label="Select Saved Signature"*/}
                {/*        >*/}
                {/*          <MenuItem value="">Draw new signature</MenuItem>*/}
                {/*          {savedSignatures.map((sig) => (*/}
                {/*            <MenuItem key={sig.id} value={sig.id}>*/}
                {/*              {sig.name}*/}
                {/*            </MenuItem>*/}
                {/*          ))}*/}
                {/*        </CustomSelect>*/}
                {/*      </FormControl>*/}
                {/*    </Grid>*/}
                {/*    <Grid size={{ xs: 6, md: 6 }}>*/}
                {/*      {selectedSignatureId ? (*/}
                {/*        <Box*/}
                {/*          sx={{*/}
                {/*            // mt: 2,*/}
                {/*            p: 2,*/}
                {/*            border: "1px solid #444",*/}
                {/*            borderRadius: 1,*/}
                {/*            maxWidth: "100%",*/}
                {/*          }}*/}
                {/*        >*/}
                {/*          <Typography*/}
                {/*            variant="caption"*/}
                {/*            sx={{ color: "white", display: "block", mb: 1 }}*/}
                {/*          >*/}
                {/*            Preview*/}
                {/*          </Typography>*/}
                {/*          <Box*/}
                {/*            component="img"*/}
                {/*            src={*/}
                {/*              savedSignatures.find(*/}
                {/*                (s) => s.id === selectedSignatureId,*/}
                {/*              )?.dataUrl*/}
                {/*            }*/}
                {/*            alt="Selected signature"*/}
                {/*            sx={{ maxWidth: "100%", background: "#1e1e1e" }}*/}
                {/*          />*/}
                {/*          <Box sx={{ mt: 1 }}>*/}
                {/*            <Button*/}
                {/*              variant="text"*/}
                {/*              color="error"*/}
                {/*              onClick={() => setSelectedSignatureId("")}*/}
                {/*            >*/}
                {/*              Choose a different signature*/}
                {/*            </Button>*/}
                {/*          </Box>*/}
                {/*        </Box>*/}
                {/*      ) : (*/}
                {/*        <Box*/}
                {/*          ref={sigContainerRef}*/}
                {/*          sx={{*/}
                {/*            p: 2,*/}
                {/*            border: "1px solid #444",*/}
                {/*            borderRadius: 1,*/}
                {/*            background: "#1e1e1e",*/}
                {/*          }}*/}
                {/*        >*/}
                {/*          <SignatureCanvas*/}
                {/*            penColor="white"*/}
                {/*            ref={sigCanvas}*/}
                {/*            backgroundColor="rgba(0,0,0,0)"*/}
                {/*            canvasProps={{*/}
                {/*              style: { width: "100%", height: 200 },*/}
                {/*            }}*/}
                {/*          />*/}
                {/*          <Box*/}
                {/*            sx={{*/}
                {/*              display: "flex",*/}
                {/*              gap: 1,*/}
                {/*              mt: 1,*/}
                {/*              flexWrap: "wrap",*/}
                {/*            }}*/}
                {/*          >*/}
                {/*            <Button*/}
                {/*              variant="outlined"*/}
                {/*              color="error"*/}
                {/*              onClick={() =>*/}
                {/*                sigCanvas.current && sigCanvas.current.clear()*/}
                {/*              }*/}
                {/*            >*/}
                {/*              Clear*/}
                {/*            </Button>*/}
                {/*            <Button*/}
                {/*              variant="contained"*/}
                {/*              color="error"*/}
                {/*              onClick={async () => {*/}
                {/*                if (*/}
                {/*                  !sigCanvas.current ||*/}
                {/*                  sigCanvas.current.isEmpty()*/}
                {/*                ) {*/}
                {/*                  alert("Please draw a signature first.");*/}
                {/*                  return;*/}
                {/*                }*/}
                {/*                const name = `Signature ${savedSignatures.length + 1}`;*/}
                {/*                try {*/}
                {/*                  let dataUrl = "";*/}
                {/*                  try {*/}
                {/*                    dataUrl = sigCanvas.current*/}
                {/*                      .getTrimmedCanvas()*/}
                {/*                      .toDataURL("image/png");*/}
                {/*                  } catch (innerErr) {*/}
                {/*                    // Fallback to full canvas if trimmed fails*/}
                {/*                    dataUrl = sigCanvas.current*/}
                {/*                      .getCanvas()*/}
                {/*                      .toDataURL("image/png");*/}
                {/*                  }*/}
                {/*                  const newSig = {*/}
                {/*                    id: `${Date.now()}`,*/}
                {/*                    name,*/}
                {/*                    dataUrl,*/}
                {/*                  };*/}
                {/*                  const updated = [*/}
                {/*                    newSig,*/}
                {/*                    ...savedSignatures,*/}
                {/*                  ].slice(0, 10);*/}
                {/*                  setSavedSignatures(updated);*/}
                {/*                  setSelectedSignatureId(newSig.id);*/}
                {/*                  if (typeof window !== "undefined") {*/}
                {/*                    window.localStorage.setItem(*/}
                {/*                      "bs_saved_signatures",*/}
                {/*                      JSON.stringify(updated),*/}
                {/*                    );*/}
                {/*                  }*/}
                {/*                } catch (e) {*/}
                {/*                  console.error("Failed to save signature:", e);*/}
                {/*                  const message =*/}
                {/*                    e && e.name === "QuotaExceededError"*/}
                {/*                      ? "Storage is full. Please remove older signatures."*/}
                {/*                      : "Failed to save signature.";*/}
                {/*                  alert(message);*/}
                {/*                }*/}
                {/*              }}*/}
                {/*            >*/}
                {/*              Save to dropdown*/}
                {/*            </Button>*/}
                {/*          </Box>*/}
                {/*        </Box>*/}
                {/*      )}*/}
                {/*    </Grid>*/}
                {/*  </Grid>*/}
                {/*</Grid>*/}

                <Grid size={{ xs: 12, md: 12 }}>
                  <CustomTextField
                    required
                    label="License Number"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid
                  size={{ xs: 12 }}
                  sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                >
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 6,
                      minWidth: "240px",
                      textTransform: "uppercase",
                    }}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  };

  const renderReviewSection = () => {
    return (
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Card elevation={3} sx={{ borderRadius: 3, background: "#242424" }}>
          <CardHeader
            title="Review and Submit"
            titleTypographyProps={{ variant: "h5", color: "error" }}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {/* Left Side - Shipping Address, Payment, Cost Breakdown, Turnaround Time */}
              <Grid size={{ xs: 12, md: 4 }}>
                {/* Shipping Address Section */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "white", mb: 3 }}
                >
                  Shipping address
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <CustomTextField
                    label="Address line 1"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    fullWidth
                    required
                  />

                  <CustomTextField
                    label="Address line 2 (Optional)"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    fullWidth
                  />

                  <CustomTextField
                    label="State/Province"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    fullWidth
                    required
                  />
                  <CustomTextField
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    fullWidth
                    required
                  />

                  <CustomTextField
                    label="Zip Code"
                    name="zip"
                    value={shippingAddress.zip}
                    onChange={handleAddressChange}
                    fullWidth
                    required
                  />
                </Box>

                <Divider sx={{ my: 4, borderColor: "#444" }} />

                {/* Cost Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ef5350", fontWeight: 600 }}
                    >
                      $379.00
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: "#444" }} />

                {/* Turnaround Time */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "white" }}>
                      Turnaround Time:
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white" }}>
                      10 Days
                    </Typography>
                  </Box>
                  {/*<Box*/}
                  {/*  sx={{*/}
                  {/*    display: "flex",*/}
                  {/*    justifyContent: "space-between",*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <Typography variant="body1" sx={{ color: "white" }}>*/}
                  {/*    Turnaround Time for Print:*/}
                  {/*  </Typography>*/}
                  {/*  <Typography variant="body1" sx={{ color: "white" }}>*/}
                  {/*    2 Business Days*/}
                  {/*  </Typography>*/}
                  {/*</Box>*/}
                </Box>
              </Grid>

              {/* Right Side - Order Summary */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "white", mb: 1 }}
                >
                  Order summary
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#aaa", mb: 4, fontSize: "0.875rem" }}
                >
                  Your treatment details are displayed here
                </Typography>

                {/* Product Card */}
                <Card
                  elevation={0}
                  sx={{
                    background: "#1e1e1e",
                    border: "1px solid #444",
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Night Guard Image */}
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        minWidth: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {/* SVG Night Guard Icon */}
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Main guard shape */}
                        <path
                          d="M20 40 Q20 25 35 25 L65 25 Q80 25 80 40 L80 60 Q80 75 65 75 L35 75 Q20 75 20 60 Z"
                          fill="rgba(255,255,255,0.15)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2"
                        />
                        {/* Teeth impressions */}
                        <ellipse
                          cx="30"
                          cy="45"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        <ellipse
                          cx="50"
                          cy="45"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        <ellipse
                          cx="70"
                          cy="45"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        {/* Bottom teeth */}
                        <ellipse
                          cx="30"
                          cy="60"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        <ellipse
                          cx="50"
                          cy="60"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        <ellipse
                          cx="70"
                          cy="60"
                          rx="8"
                          ry="6"
                          fill="rgba(255,255,255,0.2)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                      </svg>
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "white", mb: 2 }}
                      >
                        Night Guard
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#aaa", fontSize: "0.875rem" }}
                        >
                          Design Turnaround Time: 1 Business Day
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "#aaa", fontSize: "0.875rem" }}
                        >
                          Print Turnaround Time: 2 Business Days
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </Card>

                {/* Additional Order Details */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#aaa", mb: 2, fontSize: "0.875rem" }}
                  >
                    Order Information
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#aaa", mb: 0.5, fontSize: "0.875rem" }}
                    >
                      Case Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      {formData.caseName}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#aaa", mb: 0.5, fontSize: "0.875rem" }}
                    >
                      Arch
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      {formData.arch}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#aaa", mb: 0.5, fontSize: "0.875rem" }}
                    >
                      Type
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white" }}>
                      {formData.type}
                    </Typography>
                  </Box>

                  {formData.instructions && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#aaa", mb: 0.5, fontSize: "0.875rem" }}
                      >
                        Additional Instructions
                      </Typography>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {formData.instructions}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Uploaded Files Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#aaa", mb: 2, fontSize: "0.875rem" }}
                  >
                    Uploaded Files
                  </Typography>

                  {formData.upperScan && (
                    <Card
                      elevation={0}
                      sx={{
                        background: "#1e1e1e",
                        border: "1px solid #444",
                        borderRadius: 2,
                        mb: 2,
                        "&:hover": {
                          borderColor: "#666",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                          <InsertDriveFileIcon
                            sx={{ color: "#ef5350", fontSize: 32 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#aaa", mb: 0.5, fontSize: "0.75rem" }}
                            >
                              Upper Scan
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "white",
                                wordBreak: "break-word",
                                fontWeight: 500,
                              }}
                            >
                              {getFileName(formData.upperScan, 40)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() =>
                            handleFileDownload(
                              formData.upperScan,
                              formData.upperScan.name,
                            )
                          }
                          sx={{
                            color: "#ef5350",
                            "&:hover": {
                              backgroundColor: "rgba(239, 83, 80, 0.1)",
                            },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  )}

                  {formData.lowerScan && (
                    <Card
                      elevation={0}
                      sx={{
                        background: "#1e1e1e",
                        border: "1px solid #444",
                        borderRadius: 2,
                        mb: 2,
                        "&:hover": {
                          borderColor: "#666",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                          <InsertDriveFileIcon
                            sx={{ color: "#ef5350", fontSize: 32 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#aaa", mb: 0.5, fontSize: "0.75rem" }}
                            >
                              Lower Scan
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "white",
                                wordBreak: "break-word",
                                fontWeight: 500,
                              }}
                            >
                              {getFileName(formData.lowerScan, 40)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() =>
                            handleFileDownload(
                              formData.lowerScan,
                              formData.lowerScan.name,
                            )
                          }
                          sx={{
                            color: "#ef5350",
                            "&:hover": {
                              backgroundColor: "rgba(239, 83, 80, 0.1)",
                            },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  )}

                  {formData.biteScans && (
                    <Card
                      elevation={0}
                      sx={{
                        background: "#1e1e1e",
                        border: "1px solid #444",
                        borderRadius: 2,
                        mb: 2,
                        "&:hover": {
                          borderColor: "#666",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                          <InsertDriveFileIcon
                            sx={{ color: "#ef5350", fontSize: 32 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#aaa", mb: 0.5, fontSize: "0.75rem" }}
                            >
                              Bite Scans
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "white",
                                wordBreak: "break-word",
                                fontWeight: 500,
                              }}
                            >
                              {getFileName(formData.biteScans, 40)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() =>
                            handleFileDownload(
                              formData.biteScans,
                              formData.biteScans.name,
                            )
                          }
                          sx={{
                            color: "#ef5350",
                            "&:hover": {
                              backgroundColor: "rgba(239, 83, 80, 0.1)",
                            },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  )}

                  {!formData.upperScan &&
                    !formData.lowerScan &&
                    !formData.biteScans && (
                      <Card
                        elevation={0}
                        sx={{
                          background: "#1e1e1e",
                          border: "1px dashed #444",
                          borderRadius: 2,
                          py: 3,
                          px: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#aaa", fontStyle: "italic" }}
                        >
                          No files uploaded
                        </Typography>
                      </Card>
                    )}
                </Box>
              </Grid>

              {/* Bottom - Action Buttons */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 3, borderColor: "#444" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setCurrentStep("form")}
                    sx={{
                      py: 1.5,
                      px: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 6,
                      minWidth: "240px",
                      textTransform: "uppercase",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress
                          size={22}
                          color="inherit"
                          sx={{ mr: 1 }}
                        />
                        Processing...
                      </Box>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <>
      <Dialog
        open={showFirstTimePopup}
        onClose={() => {
          setShowFirstTimePopup(false);
          localStorage.setItem("bytesense_order_popup_seen", "false");
        }}
        maxWidth="md"
        fullWidth
      >
        <div>
          <iframe
            className="clickup-embed clickup-dynamic-height"
            src="https://forms.clickup.com/8469349/f/82ev5-20971/AOFNY9ZV1YO17AK26U"
            onWheel=""
            width="100%"
            height="500px"
            style={{ background: "transparent", border: "1px solid #ccc" }}
          ></iframe>
          <script
            async
            src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
          ></script>
        </div>
      </Dialog>
      {currentStep === "form" ? renderFormSection() : renderReviewSection()}
    </>
  );
}
