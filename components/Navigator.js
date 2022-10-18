import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Spinner from "./Spinner";
//Auth Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
//Application Screens
import Subnavigation from "./Subnavigation";
//Context Imports
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
//authentication check
import { onAuthStateChanged } from "firebase/auth";
import app from "../firebase-config";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
//Redux
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/user";

//create the Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function Navigator() {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useContext(AuthContext);
  const user = useSelector((state) => state.user);
  //const [user, setUser] = useContext(UserContext);
  const [status, setStatus] = useState("loading");
  //const [user, setUser] = useState({ name: null });

  const gardenListExample = [
    { name: "garden1", description: "testthis" },
    { name: "garden2", description: "this is the test for garden2" },
    { name: "garden3", description: "This one here is garden number 3" },
  ];

  const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(callback(user));
      } else {
        dispatch(callback({ name: null }));
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  if (user.name === null) {
    return <Spinner />;
  }
  const headerStyle = {
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: "#ff9977",
      borderBottomColor: "#ffffff",
      borderBottomWidth: 3,
    },
    headerTitleStyle: {
      fontSize: 18,
    },
  };
  return (
    <NavigationContainer>
      {!authState.auth || authState.auth !== true ? (
        <>
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name='Login'
              component={LoginScreen}
            />
            <Stack.Screen
              name='Register'
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='ResetPassword'
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </>
      ) : (
        <>
          <Drawer.Navigator initialRouteName='Home'>
            {gardenListExample.map((garden) => {
              {
                console.log(user.email);
              }
              return (
                <Drawer.Screen
                  key={garden.name}
                  name={garden.name}
                  component={Subnavigation}
                  options={{
                    ...headerStyle,
                  }}
                  initialParams={{ garden: garden }}></Drawer.Screen>
              );
            })}
            {/*      <Drawer.Screen name='Home' component={HomeScreen} />;
            })}
      */}
          </Drawer.Navigator>
        </>
      )}
      {/*TODO: screens that can be seen by both auth and unauth will be here. 
            Check https://reactnavigation.org/docs/auth-flow/ for further instructions*/}
      {/*
            <Stack.Group navigationKey={isSignedIn ? "user" : "guest"}>
              <Stack.Screen name='Help' component={HelpScreen} />
              <Stack.Screen name='About' component={AboutScreen} />
            </Stack.Group>*/}
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
