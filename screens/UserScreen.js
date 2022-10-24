import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import {
  Button,
  Alert,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { dangerColor, primaryDarkColor } from "../styles/colors";
const UserScreen = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");

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
    setStatus("loading");
    /*await SecureStore.setItemAsync(
      "tokens",
      JSON.stringify({
        accessToken: "",
        refreshToken: "",
      })
    );*/
    signOut(auth).then((response) => {
      setAuthState({ auth: false, user: {} });
      setStatus("idle");
    });
  };
  const loadUserData = async () => {
    setStatus("loading");
    try {
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };
  if (status === "loading") {
    return <Spinner />;
  }
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

export default UserScreen;

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
