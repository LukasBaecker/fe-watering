import React from "react";
import Navigator from "./Navigator";

//Authentication Provider
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContext";

export default function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <Navigator />
      </AxiosProvider>
    </AuthProvider>
  );
}

import {} from "react-native";
