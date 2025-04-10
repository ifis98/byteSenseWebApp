'use client'

import React from 'react';
import { combineReducers } from "redux";
// import { createSelector } from 'reselect';
import pageReducer from "./PageReducer";

// Next.js adaptation note: This reducer needs to be used within a client component

export default combineReducers({
  page: pageReducer,
});

export const getPatientId = (state) => state.page.patientId;
export const getPatient = (state) => state.page.patient;
export const getDentistDetail = (state) => state.page.dentistDetail;
