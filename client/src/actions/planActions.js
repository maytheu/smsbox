import axios from "axios";

import { PLAN_SERVER } from "../components/util/url";
import {
  VIEW_PLAN,
  VIEW_PLAN_DETAIL,
  CLEAR_PLAN,
  ADMIN_CREATE_PLAN,
  ADMIN_EDIT_PLAN
} from "./types";

export function plan() {
  const request = axios
    .get(`${PLAN_SERVER}view_plans`)
    .then(response => response.data);

  return {
    type: VIEW_PLAN,
    payload: request
  };
}

export function viewPlan(plan) {
  const request = axios
    .get(`${PLAN_SERVER}plan_details?title=${plan}`)
    .then(response => {
      return response.data[0];
    });

  return {
    type: VIEW_PLAN_DETAIL,
    payload: request
  };
}

export function clearPlan() {
  return {
    type: CLEAR_PLAN,
    payload: ""
  };
}

export function newAdminPlan(data) {
  const request = axios.post(`${PLAN_SERVER}new_plan`, data).then(response => {
    return response.data;
  });
  return {
    type: ADMIN_CREATE_PLAN,
    payload: request
  };
}
export function editAdminPlan(data) {
  const request = axios.post(`${PLAN_SERVER}edit_plan`, data).then(response => {
    return response.data;
  });
  return {
    type: ADMIN_EDIT_PLAN,
    payload: request
  };
}
