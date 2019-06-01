import axios from "axios";

import { GROUP_SERVER } from "../components/util/url";
import {
  VIEW_GROUP,
  VIEW_GROUP_DETAIL,
  DELETE_GROUP,
  NEW_GROUP,
  EDIT_GROUP
} from "./types";

export function groups() {
  const request = axios
    .get(`${GROUP_SERVER}group`)
    .then(response => response.data);

  return {
    type: VIEW_GROUP,
    payload: request
  };
}

export function detailGroup(id) {
  const request = axios
    .get(`${GROUP_SERVER}view_group?id=${id}`)
    .then(response => {
      return response.data[0];
    });
  return {
    type: VIEW_GROUP_DETAIL,
    payload: request
  };
}

export function deleteGroup(id) {
  const request = axios.get(`${GROUP_SERVER}delete?id=${id}`).then(response => {
    return response.data[0];
  });
  return {
    type: DELETE_GROUP,
    payload: request
  };
}

export function newGroup (data) {
  const request = axios
    .post(`${GROUP_SERVER}create_group`, data)
    .then(response => {
      return response.data;
    });
  return {
    type: NEW_GROUP,
    payload: request
  };
}

export function editGroup (data) {
  const request = axios
    .post(`${GROUP_SERVER}edit_group`, data)
    .then(response => {
      return response.data;
    });
  return {
    type: EDIT_GROUP,
    payload: request
  };
}
