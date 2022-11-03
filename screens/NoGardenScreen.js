import React, { useContext, useState, useEffect } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import * as SecureStore from "expo-secure-store";
import { primaryDarkColor, dangerColor } from "../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { setJoinReq } from "../store/actions/garden";
import { setStatus } from "../store/actions";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";

//TODO: Die Seite, welche geladen wird, wenn Nutzer*innen noch keinen Garten haben muss noch bearbeitet werden

/**
 * screen that is shown if the user got no garden.
 * @returns
 */
const NoGardenScreen = () => {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useContext(AuthContext);

  const logoutAlert = () => {
    Alert.alert("Wirklich ausloggen?", "", [
      {
        text: "Abbrechen",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Ausloggen",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const logout = async () => {
    dispatch(setStatus("loading"));
    signOut(auth).then((response) => {
      setAuthState({ auth: false, user: {} });
      dispatch(setStatus("idle"));
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text>placeholder</Text>
        </View>
        <TouchableOpacity style={styles.logoutbutton}>
          <Button
            color={dangerColor}
            title='Logout'
            onPress={() => logoutAlert()}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#ffff55",
    //marginBottom: 100,
  },
  content: {
    flex: 11,
    backgroundColor: primaryDarkColor,
  },
  image: {
    width: "200px",
    height: "200px",
    resizeMode: "contain",
  },
  placeholder: {
    flex: 11,
  },
  logoutbutton: {
    flex: 1,
    padding: 15,
  },
});

export default NoGardenScreen;
