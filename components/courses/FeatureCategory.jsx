import { useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_CATEGORY } from "../../schema/courseCategory"; 

const CategoryPill = ({ category_name, icon_src, active, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryPill, active && styles.activePill]}
    onPress={onPress}
  >
    <Ionicons
      name={icon_src || "apps-outline"}
      size={18}
      color={active ? "#fff" : "#25375aff"}
    />
    <Text style={[styles.categoryPillText, active && styles.activeText]}>
      {category_name}
    </Text>
  </TouchableOpacity>
);

export default function FeatureCategory({ onSelectedCategory }) {
  const { language } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  const { data, loading, error } = useQuery(GET_COURSE_CATEGORY, {
    variables: { page: 1, limit: 50, keyword: "", pagination: false },
  });

  // Notify parent whenever the selected category changes
  useEffect(() => {
    onSelectedCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#58589bff" />
      </View>
    );
  }

  if (error)
    return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const categories = [
    { _id: "All", category_name: "All", icon_src: "apps-outline" },
    ...data.getCourseCategoryWithPagination.data.map((cat) => ({
      _id: cat._id,
      category_name: cat.category_name,
      icon_src: cat.icon_src || "apps-outline",
    })),
  ];

  const handlePress = (id) => {
    setSelectedCategoryId(id);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {t("course_categories", language)}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <CategoryPill
            key={cat._id}
            category_name={cat.category_name}
            icon_src={cat.icon_src}
            active={selectedCategoryId === cat._id}
            onPress={() => handlePress(cat._id)}
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
  activePill: { backgroundColor: "#25375aff", borderColor: "#25375aff" },
  activeText: { color: "#fff" },
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
  categoryScroll: { marginBottom: 15 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, color: "red" },
});
