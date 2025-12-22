import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const CourseCard = ({ title, image, tintColor }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
    <View style={styles.textSide}>
      <View style={[styles.miniBadge, { backgroundColor: tintColor + '20' }]}>
        <Text style={[styles.miniBadgeText, { color: tintColor }]}>FREE</Text>
      </View>
      <Text style={styles.courseTitle} numberOfLines={2}>{title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>8 Lessons</Text>
        <View style={styles.dotSeparator} />
        <Text style={styles.metaText}>Beginner</Text>
      </View>
    </View>

    <View style={[styles.imageSide, { backgroundColor: tintColor + '10' }]}>
      <Image source={image} style={styles.courseIcon} resizeMode="contain" />
    </View>
  </TouchableOpacity>
);

export default function FreeCourse() {
  const { language } = useLanguage();

  const freeData = [
    { key: "introduction_to_html", img: require("../../assets/courses/html.png"), color: "#e34c26" },
    { key: "javascript_fundamentals", img: require("../../assets/courses/js.jpg"), color: "#f7df1e" },
    { key: "C_variables_and_types", img: require("../../assets/courses/cpp-var.png"), color: "#00599c" },
  ];

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("start_learning_for_free", language)}</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>{t("view_all", language)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        snapToInterval={280 + 16} 
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {freeData.map((item, index) => (
          <CourseCard
            key={index}
            title={t(item.key, language)}
            image={item.img}
            tintColor={item.color}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { marginVertical: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0f172a", letterSpacing: -0.5 },
  viewAllBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  viewAllText: { fontSize: 12, color: "#6366f1", fontWeight: "700" },
  
  scrollContent: { paddingLeft: 0, paddingRight: 16 },
  
  cardContainer: {
    width: 280, 
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 24,
    marginRight: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  textSide: {
    flex: 1.2,
    padding: 16,
    justifyContent: 'center',
  },
  miniBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  miniBadgeText: { fontSize: 10, fontWeight: "900" },
  courseTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  dotSeparator: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#cbd5e1', marginHorizontal: 6 },
  
  imageSide: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseIcon: { width: 50, height: 50 },
});