import axios from "axios";

import { EMAIL_SERVER } from "../components/util/url";
import { SEND_UPDATES } from "./types";

export function updates(data) {
  const request = axios.post(`${EMAIL_SERVER}updates`, data).then(response => {
    return response.data;
  });
  return {
    type: SEND_UPDATES,
    payload: request
  };
}
