import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_TRENDING_WITH_PAGINATION } from "../../schema/courseHomepage";
import CourseDetailModal from "../courses/CourseDetailModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

const CourseIconsPreview = ({ includes }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!includes) return null;

  const icons = [
    includes.number_of_downloadable_resources !== null && (
      <Entypo key="download" name="download" size={14} color="#000000a6" />
    ),
    includes.number_of_hours !== null && (
      <Entypo key="hours" name="hour-glass" size={14} color="#000000a6" />
    ),
    includes.number_of_lessons !== null && (
      <Entypo key="lessons" name="folder" size={14} color="#000000a6" />
    ),
    includes.number_of_video !== null && (
      <Entypo key="video" name="folder-video" size={14} color="#000000a6" />
    ),
    includes.has_certificate_of_completion && (
      <MaterialCommunityIcons
        key="certificate"
        name="certificate-outline"
        size={14}
        color="#000000a6"
      />
    ),
    includes.is_full_lifetime_access && (
      <MaterialCommunityIcons
        key="lifetime"
        name="timer-sand-full"
        size={14}
        color="#000000a6"
      />
    ),
  ].filter(Boolean);

  const tooltipItems = [
  {
    icon: <Entypo name="folder" size={14} color="#4f46e5" />,
    label: `Lessons: ${includes.number_of_lessons || 0}`,
    show: includes.number_of_lessons != null,
    bg: "#eef2ff", 
  },
  {
    icon: <Entypo name="folder-video" size={14} color="#0891b2" />,
    label: `Videos: ${includes.number_of_video || 0}`,
    show: includes.number_of_video != null,
    bg: "#ecfeff",
  },
  {
    icon: <Entypo name="hour-glass" size={14} color="#d97706" />,
    label: `Hours: ${includes.number_of_hours || 0}`,
    show: includes.number_of_hours != null,
    bg: "#fffbeb", 
  },
  {
    icon: <MaterialCommunityIcons name="clipboard-list-outline" size={14} color="#7c3aed" />,
    label: `Quizzes: ${includes.number_quizzes || 0}`,
    show: includes.number_quizzes != null,
    bg: "#f5f3ff", 
  },
  {
    icon: <MaterialCommunityIcons name="folder-multiple-outline" size={14} color="#db2777" />,
    label: `Projects: ${includes.number_of_projects_practices || 0}`,
    show: includes.number_of_projects_practices != null,
    bg: "#fdf2f8", 
  },
  {
    icon: <Entypo name="download" size={14} color="#2563eb" />,
    label: `Resources: ${includes.number_of_downloadable_resources || 0}`,
    show: includes.number_of_downloadable_resources != null,
    bg: "#eff6ff", 
  },
  {
    icon: <MaterialCommunityIcons name="timer-sand-full" size={14} color="#059669" />,
    label: "Lifetime Access",
    show: includes.is_full_lifetime_access,
    bg: "#ecfdf5",
  },
  {
    icon: <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#ea580c" />,
    label: `Access: ${includes.period_of_access_as_month} mo`,
    show: includes.period_of_access_as_month != null,
    bg: "#fff7ed", 
  },
  {
    icon: <MaterialCommunityIcons name="certificate-outline" size={14} color="#9333ea" />,
    label: "Certificate",
    show: includes.has_certificate_of_completion,
    bg: "#faf5ff", 
  },
];

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => setTooltipVisible(true)}
        onPressOut={() => setTooltipVisible(false)}
        activeOpacity={1}
        style={styles.iconGrid}
      >
        {icons.map((icon, index) => (
          <View key={index} style={styles.iconWrapper}>
            {icon}
          </View>
        ))}
      </TouchableOpacity>

     {tooltipVisible && (
  <View
    style={{
      position: "absolute",
      bottom: 50,
      left: -17,
      width: 266,
      height: 150,
      backgroundColor: "#ffffff",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.8)", 
      overflow: "hidden", 
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    }}
  >
    
    <View style={{
      position: 'absolute',
      top: -15,
      right: -15,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(99, 102, 241, 0.12)', 
    }} />
    <View style={{
      position: 'absolute',
      bottom: -20,
      left: -20,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(236, 72, 153, 0.08)', 
    }} />
    <View style={{
      position: 'absolute',
      top: 30,
      left: -40,
      width: 300,
      height: 30,
      backgroundColor: 'rgba(99, 102, 241, 0.03)', 
      transform: [{ rotate: '-15deg' }], 
    }} />

    
    <View style={{ 
      alignItems: "center", 
      marginTop: 8,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.03)',
      paddingBottom: 4,
    }}>
      <Text style={{ fontWeight: "900", fontSize: 10, color: "#1e293b", opacity: 0.6, letterSpacing: 1 }}>
        COURSE CONTENTS
      </Text>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ 
        flexDirection: "row", 
        flexWrap: "wrap", 
        justifyContent: "space-between" 
      }}>
        {tooltipItems.map((item, index) => item.show && (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "48%",
              paddingVertical: 0,
              paddingHorizontal: 6,
              marginBottom: 6,
              backgroundColor: "rgba(248, 249, 250, 0.75)", 
              borderRadius: 10,
            }}
          >
            
            <View style={{ 
              width: 22, 
              height: 22, 
              borderRadius: 6, 
              backgroundColor: item.bg || '#fff', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              {item.icon}
            </View>

            <Text
              numberOfLines={1}
              style={{
                marginLeft: 6,
                color: "#334155",
                fontSize: 9, 
                fontWeight: "700",
                flex: 1,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
)}

    </View>
  );
};

//==================== Course Card ====================//
const CourseCard = ({
  course,
  title,
  thumbnail,
  category,
  sellPrice,
  originalPrice,
  onPress,
}) => {
  const imageUri = thumbnail
    ? `${IMAGE_BASE_URL}/file/${thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  const isFree = !sellPrice || sellPrice === 0;
  const hasDiscount =
    sellPrice && originalPrice && Number(sellPrice) < Number(originalPrice);
  // console.log("hasDiscount",hasDiscount)
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.courseImage} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {category?.toUpperCase() || "COURSE"}
            </Text>
          </View>
          {hasDiscount !== 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {Math.round(
                  ((originalPrice - sellPrice) / originalPrice) * 100
                )}
                % OFF
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.courseTitle} numberOfLines={1}>
            {title || "Untitled Course"}
          </Text>
        </TouchableOpacity>

        <View style={styles.priceRow}>
          {isFree ? (
            <Text style={styles.freeText}>FREE</Text>
          ) : (
            <View style={styles.priceStack}>
              <Text style={styles.sellPrice}>
                ${Number(sellPrice).toFixed(2)}
              </Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  ${Number(originalPrice).toFixed(2)}
                </Text>
              )}
            </View>
          )}
        </View>

        <CourseIconsPreview includes={course.course_includes} />
      </View>
    </View>
  );
};

//==================== Trending Course ====================//
export default function TrendingCourse() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useQuery(
    GET_COURSE_TRENDING_WITH_PAGINATION,
    {
      variables: { limit: 10 },
    }
  );

  const handleOpenDetails = (course) => {
    if (course.has_enrolled) {
      router.push(`/course/${course._id}`);
    } else {
      setSelectedCourse(course);
      setModalVisible(true);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginVertical: 30 }} color="#6366f1" />;

  if (error || !data?.getHilightCourse?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t("courses", language)}</Text>
          <Text style={styles.headerSubtitle}>
            {t("enroll_today", language)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() => router.push("/(tabs)/courses")}
        >
          <Text style={styles.seeAllText}>{t("view_all", language)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {data.getHilightCourse.map((course) => (
          <CourseCard
            key={String(course._id)}
            course={course}
            title={course.title}
            thumbnail={course.thumbnail}
            category={course.category_id?.category_name}
            originalPrice={course.original_price}
            sellPrice={course.sell_price}
            onPress={() => handleOpenDetails(course)}
          />
        ))}
      </ScrollView>

      <CourseDetailModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

//==================== Styles ====================//
const styles = StyleSheet.create({
  container: { marginVertical: 15, marginHorizontal: 5 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  headerSubtitle: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },

  seeAllBtn: {
    backgroundColor: "#cbc0ff3f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seeAllText: { fontSize: 14, fontWeight: "800", color: "#6366f1" },

  scrollContainer: { paddingLeft: 10, paddingRight: 4 },

  cardContainer: {
    width: CARD_WIDTH,
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
  },

  imageWrapper: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  courseImage: { width: "100%", height: "100%" },

  categoryBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  categoryText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
    backgroundColor: "rgba(73, 77, 85, 0.57)",
    borderWidth: 1,
    borderColor: "white",
    padding: 2,
    borderRadius: 4,
  },

  discountPill: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomRightRadius: 15,
  },
  discountPillText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  infoWrapper: { padding: 12, flex: 1 },
  courseTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceStack: { flexDirection: "row", alignItems: "baseline", paddingTop: 10 },
  sellPrice: {
    fontSize: 17,
    fontWeight: "900",
    color: "#2b3da1ff",
    backgroundColor: "#2b3da127",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: "#e61111ff",
    textDecorationLine: "line-through",
    marginLeft: 6,
    fontWeight: "700",
  },
  freeText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#10b981",
    paddingTop: 15,
  },
  iconGrid: {
    position: "absolute",
    bottom: -1,
    right: -3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 50,
  },
  iconWrapper: {
    width: 16,
    height: 16,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    position: "absolute",
    bottom: 55,
    left: "50%",
    transform: [{ translateX: -110 }],
    width: 220,
    height: 190,
    padding: 9,
    backgroundColor: "#ffffffee",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 15,
    zIndex: 9999,
    elevation: 100,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "flex-start",
    // justifyContent:"space-between"
  },
});
