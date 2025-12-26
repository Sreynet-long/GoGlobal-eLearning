import { useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_TRENDING_WITH_PAGINATION } from "../../schema/courseHomepage";

// ==================== Course Card ====================
const CourseCard = ({ title, thumbnail, category }) => {
  const imageUri = thumbnail
    ? `${IMAGE_BASE_URL}/file/${thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category?.toUpperCase() || "GENERAL"}</Text>
        </View>

        <View style={styles.glassFooter}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {title}
          </Text>
          
          
          <View style={styles.footerRow}>
            <View style={styles.trendingIndicator}>
              {/* <View style={styles.pulseDot} />
              <Text style={styles.trendingText}>Trending</Text> */}
            </View>
            <Text style={styles.freeText}>Price $$</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// ==================== Main Component ====================
export default function TrendingCourse() {
  const { language } = useLanguage();

  const { data, loading, error } = useQuery(
    GET_COURSE_TRENDING_WITH_PAGINATION,
    { variables: { limit: 10 } }
  );

  if (loading) return <ActivityIndicator style={{ marginVertical: 20 }} />;
  if (error || !data?.getHilightCourse?.length) return null;

  const courses = data?.getHilightCourse ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          {/* <Text style={styles.headerTitle}>{t("trending_courses", language)}</Text> */}
          {/* <Text style={styles.headerSubtitle}>Popular this week</Text> */}
        </View>

        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>{t("view_all", language)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        snapToInterval={170 + 16} 
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            title={course.title}
            thumbnail={course.thumbnail}
            category={course.category_id?.category_name}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  titleGroup: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  
  seeAllBtn: { 
    backgroundColor: '#f1f5f9', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  seeAllText: { fontSize: 12, fontWeight: '700', color: '#6366f1' },
  
  scrollContainer: { paddingLeft: 20, paddingRight: 4 },
  
  cardWrapper: {
    width: 170,
    height: 200,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  glassFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    height: 26, 
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  trendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f43f5e',
    marginRight: 4,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f43f5e',
  },
  freeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10b981',
  },
});