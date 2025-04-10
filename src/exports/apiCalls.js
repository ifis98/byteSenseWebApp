import { backendLink } from "./variable";
import axios from "axios";

let accessToken = localStorage.getItem("token");
let header = {
  headers: {
    Authorization: "Bearer " + accessToken,
  },
};

console.log("this is the token we are using: " + accessToken )

function updateToken(){
   accessToken = localStorage.getItem("token");
  header = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  return header
}

export let user = {
  userRequests() {
    return {
      getProfile: () => axios.get(backendLink + "user/profile", updateToken()),
      uploadImage: (formData) =>
        axios.put(backendLink + "user/uploadImage", formData, header),
        
      updateProfile: (data) =>
        axios.put(backendLink + "user/updateProfile", data, header),
    };
  },
};

export let doctor = {
  doctorRequests() {
    return {
      getPatientList: () => axios.get(backendLink + "patientList", header),

      deletePatient: (patientID) =>
        axios.post(
          backendLink + "removePatient",
          { patient: patientID },
          header
        ),

      getPatientData: (patientID) =>
        axios.post(
          backendLink + "patientData",
          {
            userID: patientID,
          },
          header
        ),

      getpatientRequest: () =>
        axios.get(backendLink + "patientRequest", header),

      declinePatient: (patient) =>
        axios.post(
          backendLink + "declineRequest",
          { patient: patient },
          header
        ),

      addPatient: (patient) =>
        axios.post(backendLink + "addPatient", { patient: patient }, header),
      
      getGrindRatio: (patientId, singeDate, timezone) =>
        axios.post(
          backendLink + "grindRatio?userID=" + patientId +"&date="+singeDate + "&timezone="+timezone,{},
          header),
        getEpisodes: (patientId, singeDate) =>
        axios.post(
          backendLink + "episodes",
          {
            userID: patientId,
            date: singeDate
          },
          header
        ),

        getDailyReport: (patientId, singeDate) =>
        axios.post(
          backendLink + "report",
          {
            userID: patientId,
            date: singeDate
          },
          header
        ),
      
       
    };
  },
};
