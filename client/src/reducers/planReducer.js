import { VIEW_PLAN, VIEW_PLAN_DETAIL } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case VIEW_PLAN:
      return { ...state, plans: action.payload };
    case VIEW_PLAN_DETAIL:
      return { ...state, plans: action.payload };
    default:
      return state;
  }
}
