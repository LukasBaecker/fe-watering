import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
//firestore and auth dependencies
import {
  doc,
  collection,
  getDocs,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
//color schema
import { primaryColor, highlightColor } from "../styles/colors";
//loading components
import Spinner from "../components/Spinner";
//redux store import
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions/user";
//Form and Validation Dependencies
import { Formik } from "formik";
import * as yup from "yup";
const validationSchemaDE = yup.object().shape({
  email: yup.string().email("Email nicht korrekt."),
  name: yup.string().required("Bitte gib einen Namen für deinen Garten ein."),
  description: yup.string().required("Bitte füge eine Beschreibung hinzu."),
  phone: yup.string(),
});

/**
 * This screen is showing a simple search field to find existing gardens in the database
 * and send requests to join these gardens.
 * @param {*} props
 * @returns
 */
const CreateGardenScreen = (props) => {
  const dispatch = useDispatch();
  //const [description, setDescription] = useState("");
  //const [gardenName, setGardenName] = useState("");
  //const [email, setEmail] = useState("");
  //const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const user = useSelector((state) => state.user);

  /**function to create a new garden and write it to the database
   * This functions first checks if the given name is already in use for another garden in the db
   * If not the new garden will be saved to the database with an autom. created ID
   * The newly created ID is then written to the users dataset into the user.gardens array
   * Finally to not have to reload all the data from the server the current dataset is added
   * to the redux store to have the user and garden data locally available
   */
  const onCreate = async (values) => {
    try {
      setStatus("loading");
      //create the datastructure for a new garden
      const data = {
        name: values.name,
        description: values.description,
        phone: values.phone,
        email: values.email,
        roles: {},
        creator: user.auth.uid,
      };
      //add the current user to roles as an owner
      data.roles[user.auth.uid] = "owner";
      //define the query for the firestore with condition to check if garden with the given name exists
      const q = query(
        collection(db, "gardens"),
        where("name", "==", values.name)
      );
      //search the garden collection for the given gardenname
      getDocs(q)
        .then((res) => {
          if (res.docs[0] != null) {
            //if the gardenname is already in use nothing will be added
            Alert.alert(res.docs[0].data().name, "existiert bereits.");
            setStatus("idle");
          } else {
            //create a garden and safe it to the database
            // Add a new document in collection "gardens/"
            var collectionRef = collection(db, "gardens");
            addDoc(collectionRef, data)
              .then((gardenRef) => {
                let newGarden = [
                  {
                    name: values.name,
                    description: values.description,
                    roles: values.roles,
                    phone: values.phone,
                    email: values.email,
                  },
                ];
                let gardenIdArr = user.data.gardens.concat([gardenRef.id]); //arr of IDs of gardens of the auth. user with the newly created garden
                let gardenDataArr = user.gardens.concat(newGarden); //arr of garden data objects of the auth. user with the newly created garden
                //update the Redux store -> adding the new garden to user's data and the arr of garden information
                dispatch(
                  setUser({
                    auth: { ...user.auth },
                    data: { ...user.data, gardens: gardenIdArr },
                    gardens: gardenDataArr,
                  })
                );
                //create the reference to the authorized user
                let userRef = doc(db, "user", user.auth.uid);
                //update the user-collection at "user/{userId}"
                //updating only the array of gardens the user is a member of with the newly created garden
                updateDoc(userRef, {
                  gardens: gardenIdArr,
                })
                  .then(() => {
                    //if all is done
                    setStatus("idle");
                    Alert.alert("Garten erfolgreich angelegt", "", [
                      {
                        text: "Ab an die Arbeit!",
                        onPress: () => {
                          //redirect to the homepage of the new garden
                          props.navigation.navigate(values.name);
                        },
                      },
                    ]);
                  })
                  .catch((err) => {
                    console.log(err);
                    Alert.alert(
                      "Es ist ein Fehler aufgetreten. Versuch es erneut oder kontaktiere den Betreibenden der App"
                    );
                    setStatus("idle");
                  });
              })
              .catch((err) => {
                console.log(err);
                Alert.alert(
                  "Es ist ein Fehler aufgetreten. Versuch es erneut oder kontaktiere den Betreibenden der App"
                );
                setStatus("idle");
              });
          }
        })
        .catch((err) => {
          console.log("err: ", err);
          Alert.alert(
            "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber"
          );
          setStatus("idle");
        });
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber"
      );
      setStatus("idle");
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Garten anlegen</Text>
      <Formik
        initialValues={{ name: "", email: "", description: "", phone: "" }}
        validationSchema={validationSchemaDE}
        onSubmit={(values) => onCreate(values)}>
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
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                style={styles.input}
                placeholder='Gartenname'
                placeholderTextColor='#fefefe'
                autoCapitalize='none'
              />
              {errors.name && touched.name && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.name}
                </Text>
              )}
              <TextInput
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                style={styles.input}
                placeholder='Beschreibung'
                placeholderTextColor='#fefefe'
                autoCapitalize='none'
                multiline={true}
              />
              {errors.description && touched.description && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.description}
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
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                style={styles.input}
                placeholder='Telefon'
                placeholderTextColor='#fefefe'
                keyboardType='numeric'
                autoCapitalize='none'
              />
              {errors.phone && touched.phone && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.phone}
                </Text>
              )}
            </View>
            <Button
              color={highlightColor}
              title='Garten erstellen'
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
  text: {
    marginLeft: 30,
    marginRight: 30,
    color: "#fff",
  },
  logo: {
    fontSize: 40,
    color: "#fff",
    marginTop: 50,
    marginBottom: 10,
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

export default CreateGardenScreen;
