import React from "react";
import Navigator from "./components/Navigator";
import { Provider, useDispatch, useSelector } from "react-redux";
//Authentication Provider
import { AuthProvider } from "./context/AuthContext";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store/configurateStore";

let persistor = persistStore(store);
export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigator />
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}

import {} from "react-native";
