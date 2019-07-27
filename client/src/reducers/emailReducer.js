import { SEND_UPDATES, SEND_PROMOMTIONS } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case SEND_UPDATES:
      return { ...state };
    case SEND_PROMOMTIONS:
      return { ...state };
    default:
      return state;
  }
}
