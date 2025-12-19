import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import Topbar from "../../components/headers/Topbar";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Topbar showBack title="Authentication" />
      <View style={styles.contentContainer}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </View>
  );
}
//==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25375aff",
    height: 40,
  },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
});
