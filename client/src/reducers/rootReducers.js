import { combineReducers } from "redux";

import userReducer from "./userReducer";
import planReducer from "./planReducer";
import faqsReducer from "./faqsReducer";
import groupReducer from "./groupReducer";
import messageReducer from "./messageReducer";

const rootReducer = combineReducers({
  user: userReducer,
  plan: planReducer,
  faqs: faqsReducer,
  group: groupReducer,
  message: messageReducer
});

export default rootReducer;
