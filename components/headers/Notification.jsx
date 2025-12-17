import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TouchableOpacity, View } from "react-native";

export default function Notification() {
  return (
    <View>
      <TouchableOpacity>
        {/* <Ionicons name="notifications-outline" size={30} color="#FFFFFF" /> */}
        <FontAwesome5 name="bell" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
