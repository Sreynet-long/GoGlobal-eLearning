import { useQuery } from "@apollo/client";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
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
import { FILE_BASE_URL } from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_FREE_WITH_PAGINATION } from "../../schema/courseHomepage";
import CourseDetailModal from "../courses/CourseDetailModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

/* ================= ICON PREVIEW + TOOLTIP ================= */
const CourseIconsPreview = ({ includes }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!includes) return null;

  const icons = [
    includes.number_of_downloadable_resources != null && (
      <Entypo key="download" name="download" size={12} color="#0000005d" />
    ),
    includes.number_of_hours != null && (
      <Entypo key="hours" name="hour-glass" size={12} color="#0000005d" />
    ),
    includes.number_of_lessons != null && (
      <Entypo key="lessons" name="folder" size={12} color="#0000005d" />
    ),
    includes.number_of_video != null && (
      <Entypo key="video" name="folder-video" size={12} color="#0000005d" />
    ),
    includes.has_certificate_of_completion && (
      <MaterialCommunityIcons
        key="certificate"
        name="certificate-outline"
        size={12}
        color="#0000005d"
      />
    ),
    includes.is_full_lifetime_access && (
      <MaterialCommunityIcons
        key="lifetime"
        name="timer-sand-full"
        size={12}
        color="#0000005d"
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
      icon: <Entypo name="download" size={14} color="#2563eb" />,
      label: `Resources: ${includes.number_of_downloadable_resources || 0}`,
      show: includes.number_of_downloadable_resources != null,
      bg: "#eff6ff",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="certificate-outline"
          size={14}
          color="#9333ea"
        />
      ),
      label: "Certificate",
      show: includes.has_certificate_of_completion,
      bg: "#faf5ff",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="timer-sand-full"
          size={14}
          color="#059669"
        />
      ),
      label: "Lifetime Access",
      show: includes.is_full_lifetime_access,
      bg: "#ecfdf5",
    },
  ];

  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => setTooltipVisible(true)}
        onPressOut={() => setTooltipVisible(false)}
        style={styles.iconGrid}
      >
        {icons.map((icon, index) => (
          <View key={index} style={styles.iconWrapper}>
            {icon}
          </View>
        ))}
      </TouchableOpacity>

      {tooltipVisible && (
        <View style={styles.tooltipCard}>
          <Text style={styles.tooltipTitle}>COURSE CONTENTS</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.tooltipGrid}>
              {tooltipItems.map(
                (item, index) =>
                  item.show && (
                    <View key={index} style={styles.tooltipItemRow}>
                      <View
                        style={[
                          styles.tooltipIconBox,
                          { backgroundColor: item.bg },
                        ]}
                      >
                        {item.icon}
                      </View>
                      <Text style={styles.tooltipText}>{item.label}</Text>
                    </View>
                  )
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

/* ================= COURSE CARD ================= */
const CourseCard = ({ course, onPress }) => {
  const imageUri = course.thumbnail
    ? `${FILE_BASE_URL}/file/${course.thumbnail}`
    : ``;
  // const sellPrice = Number(course.sell_price);
  // const originalPrice = Number(course.original_price);
  const isFree = course.is_free_course === true || sellPrice === 0;

  // const hasDiscount = !isFree && sellPrice > 0 && originalPrice > sellPrice;
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.courseImage} />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {course.category_id?.category_name?.toUpperCase() || "COURSE"}
            </Text>
          </View>
          {/* {hasDiscount && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {Math.round(
                  ((originalPrice - sellPrice) / originalPrice) * 100
                )}
                % OFF
              </Text>
            </View>
          )} */}
        </View>
      </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {course.title}
        </Text>

        {isFree && <Text style={styles.freeText}>FREE</Text>}
        {/* {isFree && (
          // <View style={styles.priceStack}>
          //   <Text style={styles.sellPrice}>
          //     ${Number(course.sell_price).toFixed(2)}
          //   </Text>
             {hasDiscount && (
              <Text style={styles.originalPrice}>
                ${Number(course.original_price).toFixed(2)}
              </Text>
            )}
          </View>
        )} */}

        <CourseIconsPreview includes={course.course_includes} />
      </View>
    </View>
  );
};

/* ================= FREE COURSES ================= */
export default function FreeCourse() {
  const router = useRouter();
  const isAuth = useAuth();
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error, refetch } = useQuery(
    GET_COURSE_FREE_WITH_PAGINATION,
    {
      variables: { limit: 10 },
    }
  );
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    refetch();
  }, [isAuth]);

  if (loading)
    return <ActivityIndicator style={{ marginVertical: 30 }} color="#6366f1" />;

  if (error || !data?.getFreeCourse?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {t("start_learning_for_free", language)}
          </Text>
          <Text style={styles.headerSubtitle}>
            {/* {t("unlock_your_potential_today", language)} */}
            {t("access_free_courses_and_start_learning_today", language)}
            {/* Unlock your potential today! */}
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
        {data.getFreeCourse.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onPress={() => {
              if (course.has_enrolled) {
                router.push(`/course/${course._id}`);
              } else {
                setSelectedCourse(course);
                setModalVisible(true);
              }
            }}
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

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { marginVertical: 15 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 23,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#8494acff",
    fontWeight: "600",
  },

  seeAllBtn: {
    backgroundColor: "#cbc0ff3f",
    paddingHorizontal: 9,
    // paddingVertical: 6,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    marginTop: 6,
  },

  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6366f1",
    textAlign: "center",
  },

  scrollContainer: { paddingLeft: 20, paddingRight: 4 },

  cardContainer: {
    width: CARD_WIDTH,
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
    marginTop: 15,
    marginBottom: 20,
  },

  imageWrapper: {
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },

  courseImage: { width: "100%", height: "100%" },

  categoryBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  categoryText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "rgba(73,77,85,0.6)",
    padding: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "white",
  },

  infoWrapper: { padding: 12 },

  courseTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  freeText: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 15,
    fontWeight: "900",
    color: "#10b981",
    backgroundColor: "#10b98123",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },

  iconGrid: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 48,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  iconWrapper: {
    width: 16,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  tooltipCard: {
    position: "absolute",
    bottom: 50,
    left: -18,
    width: CARD_WIDTH,
    maxHeight: 180,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    // shadowColor: "#000",
    // shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 999,
    paddingVertical: 23,
  },

  tooltipTitle: {
    textAlign: "center",
    fontWeight: "900",
    opacity: 0.6,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    fontWeight: "900",
    fontSize: 13,
    color: "#1e293b",
    letterSpacing: 1,
  },

  tooltipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tooltipItemRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 6,
  },

  tooltipIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  tooltipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
});
