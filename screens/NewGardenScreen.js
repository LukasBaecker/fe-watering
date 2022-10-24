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
import { primaryColor } from "../styles/colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import Spinner from "../components/Spinner";
import { highlightColor } from "../styles/colors";
const NewGardenScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useContext(AuthContext);
  const [status, setStatus] = useState("idle");

  const createNewGarden = () => {};
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Neuen Garten anlegen</Text>
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
          props.navigation.navigate("Register");
        }}></TouchableHighlight>
      <Button
        color={highlightColor}
        title='Erstellen'
        style={styles.button}
        onPress={() => createNewGarden()}
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
    marginBottom: 30,
    color: "#fff",
    textDecorationLine: "underline",
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

export default NewGardenScreen;
