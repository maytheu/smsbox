import {
  USER_LOGIN,
  USER_AUTH,
  USER_LOGOUT,
  USER_RESET,
  USER_REGISTER
} from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, loginSucces: action.payload };
    case USER_AUTH:
      return { ...state, userData: action.payload };
    case USER_LOGOUT:
      return { ...state };
    case USER_RESET:
      return { ...state };
    case USER_REGISTER:
      return { ...state, register: action.payload };
    default:
      return state;
  }
}
