import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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

const CourseCard = ({ title, image, category }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.compactCard}>
    <Image source={image} style={styles.compactImage} />
    
    <View style={styles.compactInfo}>
      <Text style={styles.compactCategory}>{category.toUpperCase()}</Text>
      <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
      
      <View style={styles.compactFooter}>
        <View style={styles.ratingRow}>
          <Text style={styles.star}> <MaterialIcons
        name="star"
        size={19}
        color="#FFD700"
        style={{ marginTop: 13 }} 
      /></Text>
          <Text style={styles.ratingValue}>4.9</Text>
        </View>
        <Text style={styles.freeBadge}>FREE</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function TrendingCourse() {
  const { language } = useLanguage();

  const courses = [
    { id: 1, key: "python_for_data_science", img: require("../../assets/courses/python.png"), cat: "Data" },
    { id: 2, key: "CompTIA_Security", img: require("../../assets/courses/security.png"), cat: "Cyber" },
    { id: 3, key: "React_Native_Mobile", img: require("../../assets/courses/react-native.png"), cat: "Dev" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("trending_courses", language)}</Text>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>{t("view_all", language)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            title={t(course.key, language)} 
            image={course.img} 
            category={course.cat} 
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 10
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  seeAllBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  seeAllText: { fontSize: 11, fontWeight: '700', color: '#6366f1' },
  
  scrollContainer: { paddingLeft: 0, paddingRight: 0 },
  
  compactCard: {
    width: 160, 
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 12,
    padding: 8, 
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  compactImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f8fafc'
  },
  compactInfo: { marginTop: 8 },
  compactCategory: { 
    fontSize: 8, 
    fontWeight: '800', 
    color: '#94a3b8', 
    letterSpacing: 0.5 
  },
  compactTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#334155', 
    marginTop: 2 
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center',textAlign:"center", justifyContent:"center" },
  star: { fontSize: 10, marginRight: 2 },
  ratingValue: { fontSize: 11, fontWeight: '600', color: '#475569' },
  freeBadge: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#22c55e' 
  },
});