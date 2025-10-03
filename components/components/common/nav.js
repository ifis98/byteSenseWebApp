"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import { connect } from "react-redux";
import { getDentistDetail } from "../../../store/reducers";
import { backendLink } from "../../../exports/variable";
import { user } from "../../../exports/apiCalls";
import { updateDoctorDetail } from "../../../actions/APIAction";
import MenuIcon from "@mui/icons-material/Menu";

const HomePageNav = ({ updateDoctorDetail, setDrawerOpen }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [img, setImg] = useState("");
  const [imgPresent, setImgPresent] = useState(false);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await user.userRequests().getProfile();
      if (res.data.profile) {
        const pic = res.data.profile.picture;
        const fName = res.data.profile.fName || "";
        const lName = res.data.profile.lName || "";
        setImg(`${backendLink}Uploads/profilePictures/${pic}`);
        setImgPresent(!!pic);
        setDoctorName(`${fName} ${lName}`);
      }
    } catch (err) {
      console.log(err);
      await updateDoctorDetail();
      fetchData();
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleNavigation = (href) => {
    router.push(href);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "#242424", borderBottom: "1px solid #535353" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        {/* Left section (logo or placeholder) */}
        <Box>
          <MenuIcon
            className="!flex md:!hidden !cursor-pointer"
            sx={{ color: "#fff" }}
            onClick={() => setDrawerOpen(true)}
          />
        </Box>

        {/* Right icons and menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <MessageIcon sx={{ color: "#fff" }} />
          </IconButton>
          <Button
            variant="contained"
            color="error"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
            onClick={() => {
              handleNavigation("/order");
            }}
          >
            Order
          </Button>
          <IconButton>
            <NotificationsIcon sx={{ color: "#fff" }} />
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                src={imgPresent ? img : "/tempLogo.png"}
                alt="Profile"
                sx={{ width: 40, height: 40, backgroundColor: "#fff" }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                background: "#242424",
                color: "white",
              },
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ px: 2, py: 1 }}
            >
              {doctorName}
            </Typography>
            <Divider sx={{ background: "#ffffff4d" }} />
            <MenuItem onClick={() => (window.location.href = "/profile")}>
              Profile
            </MenuItem>
            <MenuItem onClick={logOut}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  getDentistDetail: getDentistDetail(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateDoctorDetail: () => dispatch(updateDoctorDetail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageNav);
