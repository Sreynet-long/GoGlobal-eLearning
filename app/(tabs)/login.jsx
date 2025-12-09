import {View, Text, StyleSheet} from "react-native";
import Topbar from "../../components/headers/Topbar";

export default function login() {
  return (
    <View style={styles.screenContainer}>
      <Topbar/>
    </View>
  )
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});