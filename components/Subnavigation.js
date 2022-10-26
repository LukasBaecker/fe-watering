import React, { useCallback, useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Spinner from "./Spinner";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; //icons for Tab-Nav
import { highlightColor, primaryColor } from "../styles/colors";
//Auth Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
//Application Screens
import HomeScreen from "../screens/HomeScreen";
import UserScreen from "../screens/UserScreen";
import GardenScreen from "../screens/GardenScreen";
import CalendarScreen from "../screens/CalendarScreen.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setGarden } from "../store/actions/garden";
export default Subnavigation = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const Tab = createBottomTabNavigator();
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

  useEffect(() => {
    //TODO: HIER MUSS ZUGRIFF AUF DIE PROPS ERLANGT WERDEN
    //TODO: oder ich finde eine Möglichkeit, wenn ein neuer Garten ausgewählt wird soll dieser
    //in den redux store dispatched werden
    //TODO: und daraufhin soll hier dann geschaut werden ob user "owner" oder "admin" ist
    // und dann werden die join Requests geladen
    if (props.garden) {
      console.log("props.garden:", props.garden);
      const findRole = props.garden.roles[user.auth.uid];
      dispatch(setGarden({ garden: props.garden, myRole: findRole }));
    } else {
      console.log("goes here");
      dispatch(setGarden({ garden: {}, myRole: "none" }));
    }
  }, [props.garden]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: primaryColor },
        tabBarInactiveTintColor: "#ffffff",
        tabBarActiveTintColor: highlightColor,
      }}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          ...headerStyle,
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Kalender'
        component={CalendarScreen}
        options={{
          headerShown: false,
          ...headerStyle,
          headerShown: false,
          tabBarLabel: "Kalender",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-month'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Garden'
        component={GardenScreen}
        options={{
          ...headerStyle,
          headerShown: false,
          tabBarLabel: "Gärten",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='watering-can'
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Dein Profil'
        component={UserScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Du",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
});
