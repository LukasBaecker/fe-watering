import { combineReducers } from "redux";
import gardenReducer from "./gardenReducer.js";
import joinReqReducer from "./joinReqReducer.js";
import userReducer from "./userReducer.js";

const rootReducer = combineReducers({
  garden: gardenReducer,
  user: userReducer,
  joinReq: joinReqReducer,
});

export default rootReducer;
