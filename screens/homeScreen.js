import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
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
          <View style={styles.view}>
            {user.gardens.map((garden) => {
              return <Text key={garden.name}>{garden.name}</Text>;
            })}
          </View>
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
});
export default HomeScreen;
