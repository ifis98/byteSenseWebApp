'use client';

import React, { useEffect, useState } from 'react';
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
  Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import { connect } from 'react-redux';
import { getDentistDetail } from '../../../store/reducers';
import { backendLink } from '../../../exports/variable';
import { user } from '../../../exports/apiCalls';
import { updateDoctorDetail } from '../../../actions/APIAction';

const HomePageNav = ({ updateDoctorDetail }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [img, setImg] = useState('');
  const [imgPresent, setImgPresent] = useState(false);
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await user.userRequests().getProfile();
      if (res.data.profile) {
        const pic = res.data.profile.picture;
        const fName = res.data.profile.fName || '';
        const lName = res.data.profile.lName || '';
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
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
        {/* Left section (logo or placeholder) */}
        <Box />

        {/* Right icons and menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <MessageIcon sx={{ color: '#ef5350' }} />
          </IconButton>
          <IconButton>
            <NotificationsIcon sx={{ color: '#ef5350' }} />
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                src={imgPresent ? img : '/tempLogo.png'}
                alt="Profile"
                sx={{ width: 40, height: 40 }}
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
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              },
            }}
          >
            <Typography variant="body2" textAlign="center" sx={{ px: 2, py: 1 }}>
              {doctorName}
            </Typography>
            <Divider />
            <MenuItem onClick={() => (window.location.href = '/profile')}>Profile</MenuItem>
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
