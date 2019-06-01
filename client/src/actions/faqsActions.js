import axios from "axios";

import { FAQS_SERVER } from "../components/util/url";
import {
  VIEW_FAQS,
  VIEW_FAQS_DETAIL,
  CLEAR_FAQS,
  ADMIN_CREATE_FAQS,
  ADMIN_EDIT_FAQS
} from "./types";

export function getFaqs() {
  const request = axios
    .get(`${FAQS_SERVER}list`)
    .then(response => response.data);

  return {
    type: VIEW_FAQS,
    payload: request
  };
}

export function viewFaqs(faqs) {
  const request = axios
    .get(`${FAQS_SERVER}view?title=${faqs}`)
    .then(response => {
      return response.data[0];
    });

  return {
    type: VIEW_FAQS_DETAIL,
    payload: request
  };
}

export function clearFaqs() {
  return {
    type: CLEAR_FAQS,
    payload: ""
  };
}

export function newAdminFaqs(data) {
  const request = axios.post(`${FAQS_SERVER}create`, data).then(response => {
    return response.data;
  });
  return {
    type: ADMIN_CREATE_FAQS,
    payload: request
  };
}
export function editAdminFaqs(data) {
  const request = axios.post(`${FAQS_SERVER}edit`, data).then(response => {
    return response.data;
  });
  return {
    type: ADMIN_EDIT_FAQS,
    payload: request
  };
}
