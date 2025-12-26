import { Image, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function EmptyCourse() {
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/find-course.png")}
        style={styles.image}
      />
      <Text style={styles.text}>{t("no_courses_found", language)}</Text>
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
  image: { marginTop: 100, width: 60, height: 60, alignSelf: "center" },
  text: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#333" },
});
