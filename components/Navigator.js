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
import { UserContext } from "../context/UserContext";
//authentication check
import { onAuthStateChanged } from "firebase/auth";
import app, { db } from "../firebase-config";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
//Redux
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/user";
import CustomDrawer from "./CustomDrawer";

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
    { name: "garden4", description: "testthis" },
    { name: "garden5", description: "this is the test for garden2" },
    { name: "garden6", description: "This one here is garden number 3" },
    { name: "garden7", description: "testthis" },
    { name: "garden8", description: "this is the test for garden2" },
    { name: "garden9", description: "This one here is garden number 3" },
  ];

  const onAuthStateChange = (callback) => {
    setStatus("loading");
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        const docRef = doc(db, "user", u.uid);
        getDoc(docRef).then((additionalUser) => {
          dispatch(callback({ ...user, auth: u, data: additionalUser.data() }));
          const gardenList = additionalUser.data().gardens;
          const q = query(
            collection(db, "gardens"),
            where("__name__", "in", gardenList)
          );
          getDocs(q).then((gardens) => {
            const gardenArr = [];
            gardens.forEach((g) => {
              gardenArr.push({
                name: g.data().name,
                description: g.data().description,
                roles: g.data().roles,
              });
              console.log("g.data():", g.data());
              console.log("gardenArr:", gardenArr);
            });
            dispatch(callback({ ...user, gardens: gardenArr }));
            setStatus("idle");

            /* gardens.forEach((g) => {
              console.log("user.gardens:", user.gardens);
              dispatch(
                callback({ ...user, gardens: user.gardens.concat([g.data()]) })
              );
              console.log("gardens:", g.data());
            });*/
          });
        });
      } else {
        dispatch(
          callback({ auth: {}, data: { firstname: "", name: "", gardens: [] } })
        );
        setAuthState({ auth: false, user: {} });
        setStatus("idle");
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <Spinner />;
  }
  const headerStyle = {
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: primaryDarkColor,
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
          <Drawer.Navigator
            initialRouteName='Home'
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              drawerActiveBackgroundColor: highlightColor,
              drawerActiveTintColor: "#fff",
            }}>
            {user.gardens.map((garden) => {
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
            <Drawer.Screen
              key={"addNewGarden"}
              name={"neuen Garten anlegen"}
              component={Subnavigation}
              style={styles.addGardenButton}
              options={{
                ...headerStyle,
              }}
            />
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
  addGardenButton: {
    color: "red",
    backgroundColor: highlightColor,
    position: "relative",
    bottom: 0,
  },
});
