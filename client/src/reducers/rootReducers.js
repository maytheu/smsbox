import { combineReducers } from "redux";

import userReducer from "./userReducer";
import planReducer from "./planReducer";
import faqsReducer from "./faqsReducer";
import groupReducer from "./groupReducer";
import messageReducer from "./messageReducer";
import emailReducer from "./emailReducer";
import aboutReducer from "./aboutReducer";

const rootReducer = combineReducers({
  user: userReducer,
  plan: planReducer,
  faqs: faqsReducer,
  group: groupReducer,
  message: messageReducer,
  email: emailReducer, 
  about: aboutReducer
});

export default rootReducer;
