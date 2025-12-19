import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function CoursesDetail() {
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("course_detail_title", language)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
});
