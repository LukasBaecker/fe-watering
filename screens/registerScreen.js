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
//colors
import { highlightColor, primaryColor } from "../styles/colors";
//Firebase
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
//Redux and Context
import { useDispatch } from "react-redux";
import { setStatus } from "../store/actions";
import { AuthContext } from "../context/AuthContext";
//Form dependencies
import { Formik } from "formik";
import * as yup from "yup";

const validationSchemaDE = yup.object().shape({
  email: yup.string().email("Email nicht korrekt."),
  name: yup.string().required("Bitte gib einen Namen für deinen Garten ein."),
  firstname: yup.string().required("Bitte gib deinen Vornamen an."),
  password: yup.string(),
});

const RegisterScreen = (props) => {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useContext(AuthContext);
  const handleRegister = async (values) => {
    try {
      /**TODO: hier wird der Auth user angelegt, aber es müssen einerseits noch
       * weitere Formular Felder hinzugefügt werden und außerdem
       */
      dispatch(setStatus("creatingNewUser"));
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCred) => {
          console.log(
            "the new user got following userRef.user.uid:",
            userCred.user.uid
          );
          //create a user-document in the firestore collection "user"
          //where the newly created UID is beeing used to safe the users data with this id
          let userRef = doc(db, "user", userCred.user.uid);
          //TODO: hier jetzt noch weitere Formularfelder hinzufügen, damit Nutzer*innen auch individuelle
          //Namen haben und nicht alle Labadaba Erik heißen
          setDoc(userRef, {
            name: values.name,
            firstname: values.firstname,
            gardens: [],
          })
            .then((u) => {
              dispatch(setStatus("idle"));
            })
            .catch((err) => {
              console.log(
                "Error at creating additional user data: ",
                err.message
              );
              Alert.alert("Es ist leider ein Fehler aufgetreten.");
            });
          setAuthState({ auth: true, user: {} });
        })
        .catch((err) => {
          if (err.message == "Firebase: Error (auth/email-already-in-use).") {
            Alert.alert("Email wird bereits verwendet.");
            props.navigation.navigate("Register");
            dispatch(setStatus("idle"));
          } else {
            console.log(err.message);
            Alert.alert("Da ist leider etwas schiefgegangen.");
          }
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Register Failed", error);
      //Alert.alert("Login Failed", error.response.data.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Registrieren</Text>
      <Formik
        initialValues={{ name: "", firstname: "", email: "", password: "" }}
        validationSchema={validationSchemaDE}
        onSubmit={(values) => handleRegister(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.form}>
              <TextInput
                onChangeText={handleChange("firstname")}
                onBlur={handleBlur("firstname")}
                value={values.firstname}
                style={styles.input}
                placeholder='Vorname'
                placeholderTextColor='#fefefe'
                autoCapitalize='none'
              />
              {errors.firstname && touched.firstname && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.firstname}
                </Text>
              )}
              <TextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                style={styles.input}
                placeholder='Name'
                placeholderTextColor='#fefefe'
                autoCapitalize='none'
              />
              {errors.name && touched.name && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.name}
                </Text>
              )}
              <TextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                style={styles.input}
                placeholder='Email'
                placeholderTextColor='#fefefe'
                keyboardType='email-address'
                autoCapitalize='none'
              />
              {errors.email && touched.email && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.email}
                </Text>
              )}
              <TextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={styles.input}
                placeholder='Passwort'
                placeholderTextColor='#fefefe'
                secureTextEntry
                autoCapitalize='none'
              />
              {errors.password && touched.password && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.password}
                </Text>
              )}
            </View>
            <TouchableHighlight
              onPress={() => {
                props.navigation.navigate("Login");
              }}>
              <Text style={styles.link}>
                Bereits registriert? Jetzt anmelden!
              </Text>
            </TouchableHighlight>
            <Button
              color={highlightColor}
              title='Registrieren'
              style={styles.button}
              onPress={() => handleSubmit()}
            />
          </>
        )}
      </Formik>
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
    fontSize: 40,
    color: "#fff",
    marginTop: "10%",
    marginBottom: 10,
  },
  form: {
    width: "80%",
    margin: "10%",
    marginTop: 10,
  },
  input: {
    fontSize: 20,
    color: "#fff",
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});

export default RegisterScreen;
