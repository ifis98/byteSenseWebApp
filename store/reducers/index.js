"use client";

import { combineReducers } from "redux";
// Reserved import for selectors if memoization is reintroduced later
import pageReducer from "./PageReducer";
import userDetails from "./UserReducer";

// In Next.js, this combined reducer is consumed only from client components

export default combineReducers({
  page: pageReducer,
  user: userDetails,
});

export const getPatientId = (state) => state.page.patientId;
export const getPatient = (state) => state.page.patient;
export const getDentistDetail = (state) => state.page.dentistDetail;
