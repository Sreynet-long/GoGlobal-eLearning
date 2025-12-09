import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, StatusBar, StyleSheet, Text, View, TouchableOpacity } from "react-native"; 
import ProfileAvatar from './ProfileAvatar'; 

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 20);

export default function Topbar() {
  return (
    <View style={styles.topContainer}>
      <View style={styles.header}>
        <View style={styles.left}>
            <Text style={styles.text}>GO eLEARNING</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.flagPlaceholder}>
             <Text style={styles.flagText}>🇬🇧</Text>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={30} color="#FFFFFF" /> 
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#25375aff", 
    paddingTop: STATUS_BAR_HEIGHT, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12, 
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingGroup: {
    marginLeft: 12,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  viewProfileText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagPlaceholder: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  flagText: {
    fontSize: 16,
    color: '#fff',
  }
});