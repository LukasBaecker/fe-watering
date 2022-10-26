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
import Spinner from "../components/Spinner";
import { primaryDarkColor } from "../styles/colors";
import { useSelector } from "react-redux";

const CreateGarden = () => {
  const user = useSelector((state) => state.user);
  const [status, setStatus] = useState("idle");

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Here you can create a new garden</Text>
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
export default CreateGarden;
