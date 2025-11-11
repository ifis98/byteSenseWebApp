import { backendLink } from "./variable";
import axios from "axios";

let accessToken = null;
let header = {
  headers: {
    Authorization: "",
  },
};

function updateToken() {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("token");
    header = {
      headers: {
        Authorization: "Bearer " + accessToken,
        "X-Is-Doctor": "true",
      },
    };
  }
  return header;
}

export let user = {
  userRequests() {
    return {
      getProfile: () => axios.get(backendLink + "user/profile", updateToken()),
      uploadImage: (formData) =>
        axios.put(backendLink + "user/uploadImage", formData, updateToken()),

      updateProfile: (data) =>
        axios.put(backendLink + "user/updateProfile", data, updateToken()),
    };
  },
};

export let doctor = {
  doctorRequests() {
    return {
      getPatientList: () =>
        axios.get(backendLink + "patientList", updateToken()),

      deletePatient: (patientID) =>
        axios.post(
          backendLink + "removePatient",
          { patient: patientID },
          updateToken()
        ),

      getPatientData: (patientID) =>
        axios.post(
          backendLink + "patientData",
          {
            userID: patientID,
          },
          updateToken()
        ),

      // addOrder:(data) => axios.post(backendLink + "createOrder", {...data},  updateToken()),
      addOrder:(data) => {
        const tokenHeader = updateToken();
        if (typeof FormData !== "undefined" && data instanceof FormData) {
          return axios.post(backendLink + "createOrder", data, {
            ...tokenHeader,
            headers: {
              ...tokenHeader.headers,
            },
          });
        }
        return axios.post(backendLink + "createOrder", { ...data }, tokenHeader);
      },

      getpatientRequest: () =>
        axios.get(backendLink + "patientRequest", updateToken()),

      declinePatient: (patient) =>
        axios.post(
          backendLink + "declineRequest",
          { patient },
          updateToken()
        ),

      addPatient: (patient) =>
        axios.post(
          backendLink + "addPatient",
          { patient },
          updateToken()
        ),

      getGrindRatio: (patientId, singeDate, timezone) =>
        axios.post(
          backendLink + "grindRatio?userID=" + patientId + "&date=" + singeDate + "&timezone=" + timezone,
          {},
          updateToken()
        ),

      getEpisodes: (patientId, singeDate) =>
        axios.post(
          backendLink + "episodes",
          {
            userID: patientId,
            date: singeDate,
          },
          updateToken()
        ),

      getDailyReport: (patientId, singeDate) =>
        axios.post(
          backendLink + "report",
          {
            userID: patientId,
            date: singeDate,
          },
          updateToken()
        ),

      getOrderList: (doctorId) =>
          axios.get(backendLink + `orders/byDoctor/${doctorId}`, updateToken()),
    };
  },
};
