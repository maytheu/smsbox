import axios from "axios";

import { USER_SERVER } from "../components/util/url";
import {
  USER_LOGIN,
  USER_AUTH,
  USER_LOGOUT,
  USER_REGISTER,
  USER_RESET,
  USER_PROFILE} from "./types";

export function loginUser(data) {
  const request = axios
    .post(`${USER_SERVER}login`, data)
    .then(response => response.data);

  return {
    type: USER_LOGIN,
    payload: request
  };
}

export function authUser() {
  const request = axios
    .get(`${USER_SERVER}auth`)
    .then(response => response.data);

  return {
    type: USER_AUTH,
    payload: request
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}logout`)
    .then(response => response.data);

  return {
    type: USER_LOGOUT,
    payload: request
  };
}

export function resetUser(data) {
  const request = axios
    .post(`${USER_SERVER}reset_user`, data)
    .then(response => response.data);

  return {
    type: USER_RESET,
    payload: request
  };
}

export function registerUser(data) {
  const request = axios
    .post(`${USER_SERVER}register`, data)
    .then(response => response.data);

  return {
    type: USER_REGISTER,
    payload: request
  };
}

export function userProfile(data) {
  const request = axios
    .post(`${USER_SERVER}edit_profile`, data)
    .then(response => response.data);

  return {
    type: USER_PROFILE,
    payload: request
  };
}
