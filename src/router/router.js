'use client'

import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes, // Changed from Switch
  Route,
  Link,
  Navigate, // Changed from Redirect
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import DentistProfile from "../pages/DentistProfile";
import BrokenPage from "../pages/BrokenPage"
import axios from "axios";
import { backendLink } from '../exports/variable';

// Next.js adaptation note: This router implementation will need to be used within a client component

class RouterControl extends Component {
  tokenCheck = async () => {
    const token = localStorage.getItem("token");
   
    axios
      .get(backendLink + "user/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };
  
  checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    let tokenStatus = this.tokenCheck();
    if (tokenStatus) {
      return true;
    } else {
      return false;
    }
  };
  
  render() {
    // Updated for React Router v6
    const AuthRoute = ({ element, ...rest }) => {
      return this.checkAuth() ? element : <Navigate to="/login" />;
    };
    
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset/:id" element={<ResetPassword />} />
          <Route path="/" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/request" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/list" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/chat" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/alerts" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/help" element={<AuthRoute element={<HomePage />} />} />
          <Route path="/profile" element={<AuthRoute element={<DentistProfile />} />} />
          <Route path="*" element={<BrokenPage />} />
        </Routes>
      </Router>
    );
  }
}

export default RouterControl;
