import axios from "axios";

import { ABOUT_SERVER } from "../components/util/url";
import { NEW_ABOUT, EDIT_ABOUT, VIEW_ABOUT, CLEAR_ABOUT } from "./types";

export function saveAbout(data) {
  const request = axios
    .post(`${ABOUT_SERVER}/new_about`, data)
    .then(response => {
      return response.data;
    });
  return {
    type: NEW_ABOUT,
    payload: request
  };
}

export function editAbout(data) {
  const request = axios.post(`${ABOUT_SERVER}/edit`, data).then(response => {
    return response.data;
  });
  return {
    type: EDIT_ABOUT,
    payload: request
  };
}

export function clearAbout() {
  return {
    type: CLEAR_ABOUT,
    payload: ""
  };
}


export function about() {
  const request = axios.get(ABOUT_SERVER).then(response => {
    return response.data;
  });
  return {
    type: VIEW_ABOUT,
    payload: request
  };
}
