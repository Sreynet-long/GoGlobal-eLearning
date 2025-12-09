import {View, Text, StyleSheet} from "react-native";
import Topbar from "../../components/headers/Topbar";

export default function login() {
  return (
    <View style={styles.screenContainer}>
      <Topbar/>
      <View style={styles.contentContainer}>

      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#25375aff",
  },
    contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
});