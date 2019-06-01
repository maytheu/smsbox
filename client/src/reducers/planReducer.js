import {
  VIEW_PLAN,
  VIEW_PLAN_DETAIL,
  ADMIN_CREATE_PLAN,
  ADMIN_EDIT_PLAN
} from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case VIEW_PLAN:
      return { ...state, plans: action.payload };
    case VIEW_PLAN_DETAIL:
      return { ...state, plans: action.payload };
    case ADMIN_CREATE_PLAN:
      return { ...state };
    case ADMIN_EDIT_PLAN:
      return { ...state };
    default:
      return state;
  }
}
