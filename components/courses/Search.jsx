import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function Search() {
  return (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={{marginRight: 8}} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses or skills..."
          placeholderTextColor="#888"
        >
        </TextInput>
        {/* <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    // backgroundColor: "#25375aff"
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 6,
    borderRadius: 20,
  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 44, 
    height: 44,
    backgroundColor: "#25375aff",
    borderRadius: 8,
  }
});
