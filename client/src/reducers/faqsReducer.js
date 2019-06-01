import {
  VIEW_FAQS,
  VIEW_FAQS_DETAIL,
  ADMIN_CREATE_FAQS,
  ADMIN_EDIT_FAQS
} from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case VIEW_FAQS:
      return { ...state, faqs: action.payload };
    case VIEW_FAQS_DETAIL:
      return { ...state, faq: action.payload };
    case ADMIN_CREATE_FAQS:
      return { ...state };
    case ADMIN_EDIT_FAQS:
      return { ...state };
    default:
      return state;
  }
}
