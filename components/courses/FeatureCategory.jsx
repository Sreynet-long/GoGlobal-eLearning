import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Category = [
  { name: "All", icon: "apps-outline" },
  { name: "Web Dev", icon: "logo-html5" },
  { name: "Graphic Design", icon: "color-palette-outline" },
  { name: "UX UI", icon: "layers-outline" },
  { name: "Computer Repair", icon: "build-outline" },
  { name: "Data Science", icon: "analytics-outline" },
  { name: "IT Support", icon: "headset-outline" },
  { name: "Video Editing", icon: "film-outline" },
];

const CategoryPill = ({ name, icon, onPress }) => (
  <TouchableOpacity style={styles.categoryPill} onPress={() => onPress(name)}>
    <Ionicons name={icon} size={18} color="#25375aff" />
    <Text style={styles.categoryPillText}>{name}</Text>
  </TouchableOpacity>
);
export default function FeatureCategory({onSelectedCategory}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Course Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {Category.map((cat, index) => (
          <CategoryPill key={index} name={cat.name} icon={cat.icon} onPress={onSelectedCategory}/>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#C8D0F5",
    backgroundColor: "#E6E9FC",
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#25375aff",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  categoryScroll: {
    marginBottom: 15,
  },
});
