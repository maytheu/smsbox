import { SEND_UPDATES } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case SEND_UPDATES:
      return { ...state };
    default:
      return state;
  }
}
