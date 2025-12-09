import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Notification() {
  return (
    <View>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
