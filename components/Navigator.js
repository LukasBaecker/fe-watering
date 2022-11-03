import React, { useCallback, useContext, useEffect, useState } from "react";
import {} from "react-native";
//color-schema
import { highlightColor, primaryDarkColor } from "../styles/colors";
//get additional data from database for the logged in user
import {
  doc,
  getDoc,
  collection,
  FieldPath,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Alert, Button, StyleSheet } from "react-native";
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
//authentication check
import { onAuthStateChanged } from "firebase/auth";
import app, { db } from "../firebase-config";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
//Redux
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/user";
import CustomDrawer from "./CustomDrawer";
import CreateGardenScreen from "../screens/CreateGardenScreen";
import SearchGarden from "../screens/SearchGardenScreen";
import NoGardenScreen from "../screens/NoGardenScreen";

//create the Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function Navigator() {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useContext(AuthContext);
  const user = useSelector((state) => state.user);
  const statusRedux = useSelector((state) => state.status);
  const [status, setStatus] = useState("loading");

  const onAuthStateChange = (callback) => {
    setStatus("loading");
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        const docRef = doc(db, "user", u.uid);
        //get the additional userdata that is saved to the firestore referenced to the auth user's id
        getDoc(docRef).then((additionalUser) => {
          var gardenList = additionalUser.data().gardens;
          var gardenArr = [];
          if (gardenList.length > 0) {
            const q = query(
              collection(db, "gardens"),
              where("__name__", "in", gardenList)
            );
            getDocs(q).then((gardens) => {
              gardens.forEach((g) => {
                gardenArr.push({
                  name: g.data().name,
                  description: g.data().description,
                  roles: g.data().roles,
                });
              });
              dispatch(
                callback({
                  auth: u,
                  data: additionalUser.data(),
                  gardens: gardenArr,
                })
              );
              setStatus("idle");
            });
          } else {
            dispatch(
              callback({
                auth: u,
                data: additionalUser.data(),
                gardens: gardenArr,
              })
            );
            setStatus("idle");
          }
        });
      } else {
        dispatch(
          callback({
            auth: {},
            data: { firstname: "", name: "", gardens: [] },
            gardens: [],
          })
        );
        setAuthState({ auth: false, user: {} });
        setStatus("idle");
      }
    });
  };

  useEffect(() => {
    if (statusRedux != "creatingNewUser") {
      const unsubscribe = onAuthStateChange(setUser);
      return () => {
        unsubscribe();
      };
    }
  }, [statusRedux]);

  if (status === "loading" || statusRedux == "creatingNewUser") {
    return <Spinner />;
  }

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
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name='Drawer'
              component={DrawerNavigation}
            />
            <Stack.Screen
              name='SearchGarden'
              component={SearchGarden}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='CreateGarden'
              component={CreateGardenScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
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

const DrawerNavigation = () => {
  const user = useSelector((state) => state.user);
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: highlightColor,
        drawerActiveTintColor: "#fff",
      }}>
      {user.gardens ? (
        user.data.gardens.length > 0 ? (
          user.gardens.map((garden) => {
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
          })
        ) : (
          <Drawer.Screen
            options={{ headerShown: false }}
            key={"noGardenYet"}
            name={"Kein Garten vorhanden"}
            component={NoGardenScreen}></Drawer.Screen>
        )
      ) : (
        <Drawer.Screen
          key={"test"}
          name={" "}
          component={Spinner}></Drawer.Screen>
      )}
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  addGardenButton: {
    color: "red",
    backgroundColor: highlightColor,
    position: "relative",
    bottom: 0,
  },
});
const headerStyle = {
  headerTintColor: "#ffffff",
  headerStyle: {
    backgroundColor: primaryDarkColor,
  },
  headerTitleStyle: {
    fontSize: 18,
  },
};
