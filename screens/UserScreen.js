import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import {
  Button,
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
const UserScreen = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");
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
      setAuthState({auth: false, user:{}});
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
      <View style={styles.header}>
        <Text>Profil</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.placeholder}></View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => logout()}
            style={{ ...styles.button, ...styles.logoutButton }}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#ff44ff",
  },
  content: {
    flex: 11,
    backgroundColor: "grey",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    height: "90%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#ff7755",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  image: {
    width: "200px",
    height: "200px",
    resizeMode: "contain",
  },
  placeholder: {
    flex: 11,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
    paddingBottom: "1%",
    paddingTop: "1%",
  },
});
