import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import * as SecureStore from "expo-secure-store";

const Dashboard = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");

  if (status === "loading") {
    return <Spinner />;
  }

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "#11bbff",
    alignItems: "center",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
export default Dashboard;
