import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function Search() {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses or skills..."
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    height: 44
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,

  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    backgroundColor: "#25375aff",
    borderRadius: 8,
  },
});
