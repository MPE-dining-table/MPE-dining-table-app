// reducer.js
import { UPDATE_PROFILE } from "./actions";

// Load initial state from localStorage
const savedProfile = JSON.parse(localStorage.getItem("profile")) || {
  firstName: "",
  lastName: "",
  email: "",
  cellphone: "",
};

const initialState = {
  profile: savedProfile,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
