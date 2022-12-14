import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
//firestore and auth dependencies
import {
  doc,
  getDoc,
  collection,
  FieldPath,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
//color schema
import { primaryColor, highlightColor } from "../styles/colors";
//loading components
import Spinner from "../components/Spinner";
//redux store import
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../store/actions";

/**
 * This screen is showing a simple search field to find existing gardens in the database
 * and send requests to join these gardens.
 * @param {*} props
 * @returns
 */
const SearchGardenScreen = (props) => {
  const dispatch = useDispatch();
  const [gardenName, setGardenName] = useState("");
  //const [status, setStatus] = useState("idle");
  const user = useSelector((state) => state.user);
  const status = useSelector((state) => state.status);

  const sendJoinRequest = (gardenId) => {
    dispatch(setStatus("loading"));
    try {
      const userRef = doc(db, "user", user.auth.uid);
      if (user.data.gardens) {
        if (!user.data.gardens.includes(gardenId)) {
          updateDoc(userRef, {
            gardens: [...user.data.gardens, gardenId],
          })
            .then(() => {
              // Add a new document in collection "gardens/{gardenId}/requests"
              var gardenRef = doc(db, "gardens", gardenId);
              setDoc(doc(gardenRef, "joinRequests", user.auth.uid), {
                state: "pending",
              })
                .then(() => {
                  Alert.alert("Anfrage wurde gesendet.");
                  dispatch(setStatus("idle"));
                })
                .catch((err) => {
                  Alert.alert("Es ist ein Fehler aufgetreten.");
                  console.log("1: ", err);
                  dispatch(setStatus("idle"));
                });
            })
            .catch((err) => {
              Alert.alert("Es ist ein Fehler aufgetreten.");
              console.log("2: ", err);
              dispatch(setStatus("idle"));
            });
        } else {
          Alert.alert("Bereits Mitglied oder Anfrage ausstehend.");
          dispatch(setStatus("idle"));
        }
      } else {
        updateDoc(userRef, {
          gardens: [gardenId],
        })
          .then(() => {
            // Add a new document in collection "gardens/{gardenId}/requests"
            var gardenRef = doc(db, "gardens", gardenId);
            setDoc(doc(gardenRef, "joinRequests", user.auth.uid), {
              state: "pending",
            })
              .then(() => {
                Alert.alert("Anfrage wurde gesendet.");
                dispatch(setStatus("idle"));
              })
              .catch((err) => {
                Alert.alert("Es ist ein Fehler aufgetreten.");
                console.log("3: ", err);
                dispatch(setStatus("idle"));
              });
          })
          .catch((err) => {
            Alert.alert("Es ist ein Fehler aufgetreten.");
            console.log("4: ", err);
            dispatch(setStatus("idle"));
          });
      }
    } catch {
      (err) => {
        dispatch(setStatus("idle"));
        Alert.alert(
          "Ein Problem ist aufgetreten. Das h??tte nicht passieren sollen!"
        );
        console.log("err:", err);
      };
    }
  };
  const onSearch = async () => {
    try {
      dispatch(setStatus("loading"));
      console.log('"test":', typeof gardenName);

      const docRef = doc(db, "gardens", "sTYq09yxN8mZaPVlaU2s");
      const q = query(
        collection(db, "gardens"),
        where("name", "==", gardenName)
      );
      getDocs(q)
        .then((res) => {
          if (res.docs[0] != null) {
            Alert.alert(
              res.docs[0].data().name,
              "M??chtest du dem Garten beitreten?",
              [
                {
                  text: "Ja, Anfrage senden.",
                  onPress: () => {
                    sendJoinRequest(res.docs[0].id);
                  },
                },
                {
                  text: "Abbrechen",
                  onPress: () => {},
                  style: "cancel",
                },
              ]
            );
          } else {
            Alert.alert("Garten existiert nicht.");
          }

          dispatch(setStatus("idle"));
        })
        .catch((err) => {
          console.log("err:", err);
          Alert.alert(
            "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber"
          );
          dispatch(setStatus("idle"));
        });
    } catch (error) {
      console.log(error);
      //const errorCode = error.code;
      const errorMessage = error.message;
      //Alert.alert("Garten konnte nicht gefunden werden.");
      Alert.alert(
        "Es ist ein Fehler aufgetreten. Versuch es erneut oder wende dich an den App-Betreiber"
      );
      dispatch(setStatus("idle"));
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Garten finden</Text>
      <Text style={styles.text}>
        Suche nach einem bereits existierenden Garten. Gibt dazu den exakten
        Namen des Gartens ein.
      </Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='Gartenname'
          placeholderTextColor='#fefefe'
          autoCapitalize='none'
          onChangeText={(text) => setGardenName(text)}
          value={gardenName}
        />
      </View>

      <Button
        color={highlightColor}
        title='Suchen'
        style={styles.button}
        onPress={() => onSearch()}
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
  text: {
    marginLeft: 30,
    marginRight: 30,
    color: "#fff",
  },
  logo: {
    fontSize: 40,
    color: "#fff",
    marginTop: 100,
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

export default SearchGardenScreen;
