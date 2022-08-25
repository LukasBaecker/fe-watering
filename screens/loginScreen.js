import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { AxiosContext } from "../context/AxiosContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);

  const onLogin = async () => {
    try {
      const response = await publicAxios.post("/user/login", {
        email,
        password,
      });
      console.log(response.data);
      const { accessToken, refreshToken } = response.data;
      console.log(authState);
      //saving the tokens to the secured store
      await SecureStore.setItemAsync(
        "tokens",
        JSON.stringify({
          accessToken,
          refreshToken,
        })
      );
      //saving the tokens in context context

      setAuthState({
        accessToken: JSON.stringify(accessToken),
        refreshToken: JSON.stringify(refreshToken),
        authenticated: true,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", error);
      //Alert.alert("Login Failed", error.response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor='#fefefe'
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor='#fefefe'
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <Button title='Login' style={styles.button} onPress={() => onLogin()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  logo: {
    fontSize: 60,
    color: "#fff",
    margin: "20%",
  },
  form: {
    width: "80%",
    margin: "10%",
  },
  input: {
    fontSize: 20,
    color: "#fff",
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  button: {},
});

export default LoginScreen;
