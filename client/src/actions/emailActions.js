import axios from "axios";

import { EMAIL_SERVER } from "../components/util/url";
import { SEND_UPDATES, SEND_PROMOMTIONS } from "./types";

export function updates(data) {
  const request = axios.post(`${EMAIL_SERVER}update`, data).then(response => {
    return response.data;
  });
  return {
    type: SEND_UPDATES,
    payload: request
  };
}

export function promotions(data) {
  const request = axios.post(`${EMAIL_SERVER}promotion`, data).then(response => {
    return response.data;
  });
  return {
    type: SEND_PROMOMTIONS,
    payload: request
  };
}
