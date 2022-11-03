import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialState = {};
const middleware = [thunk];
import expireReducer from "redux-persist-expire";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["user", "status"],
  transforms: [
    // You can add more `expireReducer` calls here for different reducers
    // that you may want to expire
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: middleware,
  preloadedState: initialState,
});

export default store;
