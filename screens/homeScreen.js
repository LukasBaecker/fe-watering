import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  Text,
  StatusBar,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import * as SecureStore from "expo-secure-store";
import { primaryDarkColor } from "../styles/colors";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {user.gardens.map((garden) => {
        return <Text key={garden.name}>{garden.name}</Text>;
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: primaryDarkColor,
    alignItems: "center",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
export default Dashboard;
