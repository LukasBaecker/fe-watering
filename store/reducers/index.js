import { combineReducers } from "redux";
import gardenReducer from "./gardenReducer.js";
import userReducer from "./userReducer.js";

const rootReducer = combineReducers({
  garden: gardenReducer,
  user: userReducer,
});

export default rootReducer;
