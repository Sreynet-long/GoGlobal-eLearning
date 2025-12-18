import { useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
    onPress={() => onPress(category_name)}
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
  const [selectedCategory, setSelectedCategory] = useState(t("all", language));

  const { data, loading, error } = useQuery(GET_COURSE_CATEGORY, {
    variables: { page: 1, limit: 50, pagination: false, keyword: "" },
  });

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color="#58589bff"
          alignItems="center"
          marginTop={20}
        />
      </View>
    );

  if (error)
    return (
      <Text style={styles.errorText}>
        {t("error_loading", language)}: {error.message}
      </Text>
    );

  const Category = [
    { category_name: t("all", language), icon_src: "apps-outline" },
    ...(data.getCourseCategoryWithPagination?.data || []).map((cat) => ({
      category_name: cat.category_name,
      icon_src: cat.icon_src || "apps-outline",
    })),
  ];

  const handlePress = (category_name) => {
    setSelectedCategory(category_name);
    onSelectedCategory(category_name);
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
    backgroundColor: "#25375aff",
    borderColor: "#25375aff",
  },
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
  loadingText: { textAlign: "center", marginTop: 20, color: "#666" },
  errorText: { textAlign: "center", marginTop: 20, color: "red" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
