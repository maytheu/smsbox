import {
  VIEW_GROUP,
  VIEW_GROUP_DETAIL,
  DELETE_GROUP,
  NEW_GROUP,
  EDIT_GROUP
} from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case VIEW_GROUP:
      return { ...state, groups: action.payload };
    case VIEW_GROUP_DETAIL:
      return { ...state, groups: action.payload };
    case DELETE_GROUP:
      return { ...state };
    case NEW_GROUP:
      return { ...state };
    case EDIT_GROUP:
      return { ...state };
    default:
      return state;
  }
}
