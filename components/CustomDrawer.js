import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { primaryDarkColor } from "../styles/colors";
import { useSelector } from "react-redux";

//this component is for individualize the drawer navigation
const CustomDrawer = (props) => {
  const user = useSelector((state) => state.user);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: primaryDarkColor,
        }}>
        {/*<ImageBackground
          source={require("../assets/images/menu-bg.jpeg")}
  style={{ padding: 20 }}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            marginBottom: 10,
            padding: 20,
            marginLeft: 15,
          }}
        />*/}
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            marginTop: 20,
            marginBottom: 5,
            marginLeft: 15,
          }}>
          {user.data.firstname + " " + user.data.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: "#fff",
              marginRight: 5,
              marginLeft: 15,
              marginBottom: 20,
            }}>
            280 Coins
          </Text>
          <FontAwesome5 name='coins' size={14} color='#fff' />
        </View>
        {/*</ImageBackground>*/}
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingTop: 0,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <View style={styles.bottomIconViews}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("SearchGarden");
            }}
            style={{ paddingVertical: 0 }}>
            <Ionicons name='search-circle-outline' size={50} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomIconViews}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("CreateGarden");
            }}
            style={{ paddingVertical: 0 }}>
            <Ionicons name='add-circle-outline' size={50} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomIconViews: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
export default CustomDrawer;
