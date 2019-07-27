import { NEW_ABOUT, EDIT_ABOUT, VIEW_ABOUT } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case NEW_ABOUT:
      return { ...state };
    case EDIT_ABOUT:
      return { ...state };
    case VIEW_ABOUT:
      return { ...state, about: action.payload };
    default:
      return state;
  }
}
