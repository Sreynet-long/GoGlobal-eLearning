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
const CARD_WIDTH = width * 0.7;

/* ================= ICON PREVIEW + TOOLTIP ================= */
const CourseIconsPreview = ({ includes }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!includes) return null;

  const icons = [
    includes.number_of_downloadable_resources !== null && (
      <Entypo key="download" name="download" size={12} color="#0000005d" />
    ),
    includes.number_of_hours !== null && (
      <Entypo key="hours" name="hour-glass" size={12} color="#0000005d" />
    ),
    includes.number_of_lessons !== null && (
      <Entypo key="lessons" name="folder" size={12} color="#0000005d" />
    ),
    includes.number_of_video !== null && (
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
      icon: <Entypo name="folder" size={12} color="#4f46e5" />,
      label: `Lessons: ${includes.number_of_lessons || 0}`,
      show: includes.number_of_lessons != null,
      bg: "#eef2ff",
    },
    {
      icon: <Entypo name="folder-video" size={12} color="#0891b2" />,
      label: `Videos: ${includes.number_of_video || 0}`,
      show: includes.number_of_video != null,
      bg: "#ecfeff",
    },
    {
      icon: <Entypo name="hour-glass" size={12} color="#d97706" />,
      label: `Hours: ${includes.number_of_hours || 0}`,
      show: includes.number_of_hours != null,
      bg: "#fffbeb",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="clipboard-list-outline"
          size={12}
          color="#7c3aed"
        />
      ),
      label: `Quizzes: ${includes.number_quizzes || 0}`,
      show: includes.number_quizzes != null,
      bg: "#f5f3ff",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="folder-multiple-outline"
          size={12}
          color="#db2777"
        />
      ),
      label: `Projects: ${includes.number_of_projects_practices || 0}`,
      show: includes.number_of_projects_practices != null,
      bg: "#fdf2f8",
    },
    {
      icon: <Entypo name="download" size={12} color="#2563eb" />,
      label: `Resources: ${includes.number_of_downloadable_resources || 0}`,
      show: includes.number_of_downloadable_resources != null,
      bg: "#eff6ff",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="timer-sand-full"
          size={12}
          color="#059669"
        />
      ),
      label: "Lifetime Access",
      show: includes.is_full_lifetime_access,
      bg: "#ecfdf5",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={12}
          color="#ea580c"
        />
      ),
      label: `Access: ${includes.period_of_access_as_month} mo`,
      show: includes.period_of_access_as_month != null,
      bg: "#fff7ed",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="certificate-outline"
          size={12}
          color="#9333ea"
        />
      ),
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
            left: -18,
            width: CARD_WIDTH,
            height: 155,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 0,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.8)",
            overflow: "hidden",
            // shadowColor: "#000",
            // shadowOpacity: 0.1,
            // shadowRadius: 10,
            // shadowOffset: { width: 0, height: 4 },
            // elevation: 5,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -15,
              right: -15,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(123, 241, 99, 0.12)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(72, 97, 236, 0.08)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              left: -40,
              width: 300,
              height: 30,
              backgroundColor: "rgba(99, 102, 241, 0.03)",
              transform: [{ rotate: "-15deg" }],
            }}
          />

          <View
            style={{
              alignItems: "center",
              marginTop: 2,
              marginBottom: 2,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.03)",
              paddingBottom: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                fontSize: 13,
                color: "#1e293b",
                opacity: 0.7,
                letterSpacing: 1,
              }}
            >
              COURSE CONTENTS
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingBottom: 2,
              }}
            >
              {tooltipItems.map(
                (item, index) =>
                  item.show && (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "48%",
                        paddingVertical: 0,
                        paddingHorizontal: 2,
                        marginBottom: 0,
                        backgroundColor: "rgba(248, 249, 250, 0.85)",
                        borderRadius: 10,
                        minHeight: 32,
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 18,
                          borderRadius: 6,
                          backgroundColor: item.bg || "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.icon}
                      </View>

                      <Text
                        numberOfLines={1}
                        style={{
                          marginLeft: 3,
                          color: "#1e293b",
                          fontSize: 12,
                          fontWeight: "700",
                          letterSpacing: -0.2,
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </Text>
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
  const [imageLayout, setImageLayout] = useState(null);

  const imageUri = course.thumbnail
    ? `${IMAGE_BASE_URL}/file/${course.thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  const isFree = !course.sell_price || course.sell_price === 0;
  const hasDiscount =
    course.sell_price &&
    course.original_price &&
    Number(course.sell_price) < Number(course.original_price);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} delayPressIn={80}>
        <View
          style={styles.imageWrapper}
          onLayout={(e) => setImageLayout(e.nativeEvent.layout)}
        >
          <Image source={{ uri: imageUri }} style={styles.courseImage} />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {course.category_id?.category_name?.toUpperCase() || "COURSE"}
            </Text>
          </View>

          {hasDiscount !== 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>
                {Math.round(
                  ((course.original_price - course.sell_price) /
                    course.original_price) *
                    100
                )}
                % OFF
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {course.title}
        </Text>

        {isFree ? (
          <Text style={styles.freeText}>FREE</Text>
        ) : (
          <View style={styles.priceStack}>
            <Text style={styles.sellPrice}>
              ${Number(course.sell_price).toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                ${Number(course.original_price).toFixed(2)}
              </Text>
            )}
          </View>
        )}

        <CourseIconsPreview
          includes={course.course_includes}
          imageLayout={imageLayout}
        />
      </View>
    </View>
  );
};

/* ================= TRENDING COURSES ================= */
export default function TrendingCourse() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useQuery(
    GET_COURSE_TRENDING_WITH_PAGINATION,
    { variables: { limit: 10 } }
  );

  if (loading)
    return <ActivityIndicator style={{ marginVertical: 30 }} color="#6366f1" />;

  if (error || !data?.getHilightCourse?.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {t("Your_Learning_Journey", language)}
          </Text>
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
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#0f172a" },
  headerSubtitle: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },

  seeAllBtn: {
    backgroundColor: "#cbc0ff3f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  seeAllText: { fontSize: 14, fontWeight: "800", color: "#6366f1" },

  scrollContainer: { paddingLeft: 20, marginRight: 20 },

  cardContainer: {
    width: CARD_WIDTH,
    // height: 220,
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

  infoWrapper: { padding: 12 },

  courseTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  priceStack: { flexDirection: "row", alignItems: "baseline", marginTop: 8 },
  sellPrice: {
    fontSize: 17,
    fontWeight: "900",
    color: "#2b3da1",
    backgroundColor: "#2b3da127",
    paddingHorizontal: 4,
    borderRadius: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: "#e11d48",
    marginLeft: 6,
    textDecorationLine: "line-through",
    fontWeight: "700",
  },
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
    width: CARD_WIDTH,
    maxHeight: 190,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 999,
  },
  tooltipTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "900",
    opacity: 0.6,
    marginBottom: 6,
  },
  tooltipItem: {
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 2,
  },
});
