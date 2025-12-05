'use client'

import React from 'react';
import { combineReducers } from 'redux';
import {
  UPDATE_DENTIST_DETAIL,
  UPDATE_PATIENT_DETAIL,
  UPDATE_PATIENT_ID
} from '../actions/actionTypes/ActionTypes';

// This reducer bundle is intended for client-side usage within Next.js pages

const patientId = (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_PATIENT_ID:
      return payload;
    default:
      return state;
  }
};

const dentistDetail = (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_DENTIST_DETAIL:
      return payload;
    default:
      return state;
  }
};

const patient = (state ={}, { type, payload }) => {
  switch (type) {
    case UPDATE_PATIENT_DETAIL:
      return payload;
    default:
      return state;
  }
};

export default combineReducers({
  patientId,
  patient,
  dentistDetail
});
