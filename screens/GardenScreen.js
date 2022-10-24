import React from "react";
import { StyleSheet, Text, TouchableOpacity, SafeAreaView } from "react-native";
//redux
import { useSelector } from "react-redux";
import { primaryDarkColor } from "../styles/colors";
const GardenScreen = () => {
  const user = useSelector((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{user.email}</Text>
    </SafeAreaView>
  );
};

export default GardenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryDarkColor,
    tintColor: "#ffffff",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  text: {
    color: "#ffffff",
  },
});
