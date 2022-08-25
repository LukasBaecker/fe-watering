import React, { useCallback, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

//import Dashboard from './src/components/Dashboard';
import Spinner from "./components/Spinner";

//Auth Screens
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import ResetPasswordScreen from "./screens/resetPasswordScreen";

//Application Screens
import HomeScreen from "./screens/homeScreen";
import AnotherScreen from "./screens/anotherScreen";

//Context Imports
import { AuthContext } from "./context/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [authState, setAuthState] = useContext(AuthContext);
  const [status, setStatus] = useState("loading");

  const loadJWT = useCallback(async () => {
    try {
      const tokens = JSON.parse(await SecureStore.getItemAsync("tokens", {}));
      if (
        (!tokens.accessToken && !tokens.refreshToken) ||
        (tokens.accessToken === "" && tokens.refreshToken === "")
      ) {
        console.log("do you get here not goodd");
        console.log(tokens.accessToken);
        setAuthState({
          accessToken: "",
          refreshToken: "",
          authenticated: false,
        });
        setStatus("Unauthorized");
      } else {
        console.log("do you get here");
        console.log(tokens.accessToken);
        setAuthState({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          authenticated: true,
        });
        setStatus("Success");
      }
    } catch (error) {
      console.log("do you get here to this error");
      setStatus("Unauthorized");
      setAuthState({
        accessToken: "",
        refreshToken: "",
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
    <NavigationContainer>
      <Stack.Navigator>
        {!authState || authState.authenticated !== true ? (
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
        ) : (
          <>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Another' component={AnotherScreen} />
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
