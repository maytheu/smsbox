import { combineReducers } from "redux";

import userReducer from "./userReducer";
import planReducer from "./planReducer";
import faqsReducer from "./faqsReducer";
import groupReducer from "./groupReducer";
import messageReducer from "./messageReducer";
import emailReducer from "./emailReducer";

const rootReducer = combineReducers({
  user: userReducer,
  plan: planReducer,
  faqs: faqsReducer,
  group: groupReducer,
  message: messageReducer,
  email: emailReducer
});

export default rootReducer;
