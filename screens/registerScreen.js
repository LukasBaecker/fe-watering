import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { highlightColor, primaryColor } from "../styles/colors";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          //const user = userCredential.user;
          //console.log(user.email);
          setAuthState({ auth: true, user: {} });
        }
      );
      /*
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
      });*/
    } catch (error) {
      console.log(error);
      Alert.alert("Register Failed", error);
      //Alert.alert("Login Failed", error.response.data.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Registrieren</Text>
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

      <TouchableHighlight
        onPress={() => {
          props.navigation.navigate("Login");
        }}>
        <Text style={styles.link}>Bereits registriert? Jetzt anmelden!</Text>
      </TouchableHighlight>
      <Button
        color={highlightColor}
        title='Registrieren'
        style={styles.button}
        onPress={() => handleRegister()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  link: {
    marginBottom: 10,
    color: "#fff",
    textDecorationLine: "underline",
  },
  logo: {
    fontSize: 60,
    color: "#fff",
    marginTop: "20%",
    marginBottom: "20%",
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
  button: { backgroundColor: highlightColor },
});

export default RegisterScreen;
