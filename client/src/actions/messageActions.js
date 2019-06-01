import axios from "axios";

import { MESSAGE_SERVER } from "../components/util/url";
import { SEND_MESSAGE } from "./types";

export function sendSms(msg) {
  const request = axios
    .post(`${MESSAGE_SERVER}new_message`, msg)
    .then(response => response.data);

  return {
    type: SEND_MESSAGE,
    payload: request
  };
}
