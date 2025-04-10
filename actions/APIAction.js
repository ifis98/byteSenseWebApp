import {
    UPDATE_DENTIST_DETAIL,
    UPDATE_PATIENT_DETAIL,
    UPDATE_PATIENT_DETAIL_ERROR,
  } from "./actionTypes/ActionTypes";
  
  import { doctor, user } from "../exports/apiCalls";
  
  
  export const updateDoctorDetail = () => {
    return function (dispatch){
    return user.userRequests().getProfile()
    .then((response) => {
      dispatch({ type: UPDATE_DENTIST_DETAIL, payload: response.data });
      return true;
    }).catch(error =>{
      console.log(error.response.data);
    })
  }
  }
  
  export const updatePatientDetail = (value) => {
    return function (dispatch) {
      return doctor.doctorRequests().getPatientData(value)
        .then((response) => {
          dispatch({ type: UPDATE_PATIENT_DETAIL, payload: response.data });
          console.log(response.data)
          return true;
        })
        .catch((error) => {
          console.log("error redux");
          dispatch({ type: UPDATE_PATIENT_DETAIL_ERROR, payload: error });
        });
    };
  };