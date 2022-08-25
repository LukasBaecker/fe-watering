import React, { useContext, useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { AxiosContext } from "../context/AxiosContext";
import Spinner from "../components/Spinner";
import * as SecureStore from "expo-secure-store";

const Dashboard = () => {
  const axiosContext = useContext(AxiosContext);
  const [authState, setAuthState] = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");

  const logout = async () => {
    await SecureStore.setItemAsync(
      "tokens",
      JSON.stringify({
        accessToken: "",
        refreshToken: "",
      })
    );
    setAuthState({
      accessToken: "",
      refreshToken: "",
      authenticated: false,
    });
  };

  const loadUserData = async () => {
    setStatus("loading");
    try {
      const response = await axiosContext.authAxios.get("/user/me");
      console.log(response.data);
      setImage(response.data.avatar);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      {image == "" ? (
        <></>
      ) : (
        <Image
          source={{ uri: image }}
          width={200}
          height={200}
          style={styles.image}
        />
      )}

      <View style={styles.buttonGroup}>
        <Button title='Get My Data' onPress={loadUserData} />
        <Button title='Logout' onPress={() => logout()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: "200px",
    height: "200px",
    resizeMode: "contain",
  },
  buttonGroup: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
});
export default Dashboard;
