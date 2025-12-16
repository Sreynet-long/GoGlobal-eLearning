import { useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_COURSE_CATEGORY } from "../../schema/courseCategory";

// const Category = [
//   { name: "All", icon: "apps-outline" },
//   { name: "Web Dev", icon: "logo-html5" },
//   { name: "Graphic Design", icon: "color-palette-outline" },
//   { name: "UX UI", icon: "layers-outline" },
//   { name: "Computer Repair", icon: "build-outline" },
//   { name: "Data Science", icon: "analytics-outline" },
//   { name: "IT Support", icon: "headset-outline" },
//   { name: "Video Editing", icon: "film-outline" },
// ];

const CategoryPill = ({ category_name, icon_src, active, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryPill, active && styles.activePill]}
    onPress={() => onPress(category_name)}
  >
    <Ionicons
      name={icon_src || "alert-circle-outline"}
      size={18}
      color="#25375aff"
    />
    <Text
      style={[
        styles.categoryPillText,
        active.categoryPillText && styles.activeText,
      ]}
    >
      {category_name}
    </Text>
  </TouchableOpacity>
);
export default function FeatureCategory({ onSelectedCategory }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, loading, error } = useQuery(GET_COURSE_CATEGORY, {
    variables: { page: 1, limit: 100, pagination: false },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const Category = [
    { category_name: "All", icon_src: "apps-outline" },
    ...data.getCourseCategoryWithPagination.data.map((cat) => ({
      category_name: cat.category_name,
      icon_src: cat.icon_src,
    })),
  ];

  const handlePress = (category_name) => {
    setSelectedCategory(category_name);
    onSelectedCategory(category_name);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Course Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {Category.map((cat, index) => (
          <CategoryPill
            key={index}
            category_name={cat.category_name}
            icon_src={cat.icon_src}
            active={selectedCategory === cat.category_name}
            onPress={handlePress}
          />
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
  activePill: {
    backgroundColor: "#dfdedeff",
    borderColor: "#25375aff",
  },
  activeText: {
    color: "#fff",
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
