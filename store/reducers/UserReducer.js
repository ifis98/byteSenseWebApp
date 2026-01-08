"use client";

import {
  RESET_USER_DETAIL,
  UPDATE_USER_DETAIL,
} from "../actions/actionTypes/ActionTypes";

const initialState = {
  isAccepted: false,
};

const userDetails = (state = { ...initialState }, { type, payload }) => {
  switch (type) {
    case UPDATE_USER_DETAIL:
      return payload;
    case RESET_USER_DETAIL:
      return { ...initialState };
    default:
      return state;
  }
};

export default userDetails;
