import React, { useCallback, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Keychain from "react-native-keychain";
//import Dashboard from './src/components/Dashboard';
import Spinner from "./components/Spinner";

//Auth Screens
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import ResetPasswordScreen from "./screens/resetPasswordScreen";

//Application Screens
import HomeScreen from "./screens/homeScreen";
import AnotherScreen from "./screens/anotherScreen";

//Authentication Provider
import { AuthContext } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import { AxiosProvider } from "./context/AxiosContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState("loading");

  const loadJWT = useCallback(async () => {
    try {
      const value = await Keychain.getGenericPassword();
      const jwt = JSON.parse(value.password);

      authContext.setAuthState({
        accessToken: jwt.accessToken || false,
        refreshToken: jwt.refreshToken || false,
        authenticated: jwt.accessToken !== false,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: false,
        refreshToken: false,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <AuthProvider>
      <AxiosProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {authContext === false &&
            authContext.authState === false &&
            authContext.authenticated === false ? (
              <>
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='Another' component={AnotherScreen} />
              </>
            ) : (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name='Login'
                  component={LoginScreen}
                />
                <Stack.Screen name='Register' component={RegisterScreen} />
                <Stack.Screen
                  name='ResetPassword'
                  component={ResetPasswordScreen}
                />
              </>
            )}
            {/*TODO: screens that can be seen by both auth and unauth will be here. 
            Check https://reactnavigation.org/docs/auth-flow/ for further instructions*/}
            {/*
            <Stack.Group navigationKey={isSignedIn ? "user" : "guest"}>
              <Stack.Screen name='Help' component={HelpScreen} />
              <Stack.Screen name='About' component={AboutScreen} />
            </Stack.Group>*/}
          </Stack.Navigator>
        </NavigationContainer>
      </AxiosProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
});

import {} from "react-native";
