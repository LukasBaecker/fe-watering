import { ActivityIndicator, StyleSheet, View } from "react-native";
import { highlightColor } from "../styles/colors";

const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size='large' color={highlightColor} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Spinner;
