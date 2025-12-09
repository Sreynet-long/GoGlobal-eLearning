import { View,TouchableOpacity,Text, StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const ModuleTile = ({ title, iconName, color }) => (
  <TouchableOpacity style={styles.moduleTile}>
    <Ionicons name={iconName} size={30} color={color} />
    <Text style={styles.moduleTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function UtilityModules() {
  return (
    <View>
      <View style={styles.moduleGrid}>
        <ModuleTile
          title="MY ENROLLMENTS"
          iconName="book-outline"
          color="#3F51B5"
        />
        <ModuleTile
          title="CERT TRACKS"
          iconName="clipboard-outline"
          color="#FF5722"
        />
        <ModuleTile
          title="COMMUNITY"
          iconName="people-outline"
          color="#4CAF50"
        />
        <ModuleTile
          title="LIVE SESSIONS"
          iconName="calendar-outline"
          color="#00BCD4"
        />
        <ModuleTile
          title="KNOWLEDGE BASE"
          iconName="bulb-outline"
          color="#FFC107"
        />
        <ModuleTile
          title="SKILL QUIZZES"
          iconName="bar-chart-outline"
          color="#E91E63"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  moduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moduleTile: {
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  moduleTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginTop: 6,
  },  
})
