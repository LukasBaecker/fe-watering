import { combineReducers } from "redux";
import gardenReducer from "./gardenReducer.js";
import joinReqReducer from "./joinReqReducer.js";
import statusReducer from "./statusReducer.js";
import userReducer from "./userReducer.js";

const rootReducer = combineReducers({
  garden: gardenReducer,
  user: userReducer,
  joinReq: joinReqReducer,
  status: statusReducer,
});

export default rootReducer;
