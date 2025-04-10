import {
  UPDATE_PATIENT_ID
} from './actionTypes/ActionTypes';

export const updatePatientID = value => {
  return {
    type: UPDATE_PATIENT_ID,
    payload: value
  };
};


