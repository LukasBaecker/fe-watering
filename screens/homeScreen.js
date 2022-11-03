import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Text,
  StatusBar,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import * as SecureStore from "expo-secure-store";
import { primaryDarkColor } from "../styles/colors";
import { useDispatch, useSelector } from "react-redux";
import { setJoinReq } from "../store/actions/garden";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JoinRequestsScreen from "./JoinRequestsScreen";

const Stack = createNativeStackNavigator();

export const HomeScreenNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name='Home'
        component={HomeScreen}
      />
      <Stack.Screen
        name='JoinRequests'
        component={JoinRequestsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const HomeScreen = () => {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useContext(AuthContext);
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("idle");
  const garden = useSelector((state) => {
    state.garden;
  });
  const joinReq = useSelector((state) => {
    state.joinReq;
  });
  if (status === "loading") {
    return <Spinner />;
  }

  //update the joinReq if the activeGarden is changing
  //check first if the user is admin or owner of the activeGarden
  //to prevent from making a request to firestore that will fail
  useEffect(() => {
    if (garden && (garden.myRole == "owner" || garden.myRole == "admin")) {
      //then do the request to the database /garden/id/joinRequests if there are any requests
      //and write them to redux store -> joinReq
    } else {
      dispatch(setJoinReq([]));
    }
  }, [garden]);

  return (
    <SafeAreaView style={styles.container}>
      {user.gardens ? (
        <>
          <View style={styles.view}>
            {user.gardens.map((garden) => {
              return <Text key={garden.name}>{garden.name}</Text>;
            })}
          </View>
          <View style={styles.viewTwo}>
            <TouchableOpacity>
              <View style={styles.joinRequests}>
                <Text>TEst this damn</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/**
           * TODO: Die austehenden Anfragen könnte man erst als eine Zahl in einem Kasten machen und dann wenn man draufklickt in einem neuen Screen
           * Hier werden diese einfach aufgelistet als Cards
           * Nutzername und wie lange das her ist.
           * Außerdem hat jede Karte die Knöpfe annehmen und Ablehnen
           */}
        </>
      ) : (
        <></>
      )}
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
  view: {
    flex: 1,
  },
  viewTwo: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  joinRequests: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
export default HomeScreen;
