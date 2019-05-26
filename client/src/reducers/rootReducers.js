import { combineReducers } from "redux";

import userReducer from "./userReducer";
import planReducer from "./planReducer";

const rootReducer = combineReducers({
    user: userReducer,
    plan: planReducer
});

export default rootReducer;
