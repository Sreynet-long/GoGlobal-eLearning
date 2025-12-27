import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_TRENDING_WITH_PAGINATION } from "../../schema/courseHomepage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.55;

const CourseCard = ({
  title,
  thumbnail,
  category,
  sellPrice,
  originalPrice,
}) => {
  const imageUri = thumbnail
    ? `${IMAGE_BASE_URL}/file/${thumbnail}`
    : `${IMAGE_BASE_URL}/default/course.png`;

  const isFree = !sellPrice || sellPrice === 0;
  const hasDiscount =
    sellPrice && originalPrice && Number(sellPrice) < Number(originalPrice);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.courseImage} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {category?.toUpperCase() || "COURSE"}
          </Text>
        </View>
        {hasDiscount && (
          <View style={styles.discountPill}>
            <Text style={styles.discountPillText}>
              {Math.round(((originalPrice - sellPrice) / originalPrice) * 100)}%
              OFF
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            {isFree ? (
              <Text style={styles.freeText}>FREE</Text>
            ) : (
              <View style={styles.priceStack}>
                <Text style={styles.sellPrice}>${sellPrice.toFixed(2)}</Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>${originalPrice}</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.featureStrip}>
            <View style={[styles.iconWrapper, { backgroundColor: "#f0fdf4" }]}>
              <MaterialCommunityIcons
                name="cloud-download-outline"
                size={14}
                color="#16a34a"
              />
            </View>

            <View style={[styles.iconWrapper, { backgroundColor: "#fff7ed" }]}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={14}
                color="#ea580c"
              />
            </View>

            <View style={[styles.iconWrapper, { backgroundColor: "#fef2f2" }]}>
              <MaterialIcons name="live-tv" size={14} color="#dc2626" />
            </View>

            <View style={[styles.iconWrapper, { backgroundColor: "#fefce8" }]}>
              <MaterialIcons
                name="workspace-premium"
                size={14}
                color="#ca8a04"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TrendingCourse() {
    const router = useRouter();
  const { language } = useLanguage();
  const { data, loading, error } = useQuery(
    GET_COURSE_TRENDING_WITH_PAGINATION,
    {
      variables: { limit: 10 },
    }
  );

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
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push("/(tabs)/courses")}>

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
            {...course}
            category={course.category_id?.category_name}
            originalPrice={course.original_price}
            sellPrice={course.sell_price}
          />
        ))}
      </ScrollView>
    </View>
  );
}

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
    marginVertical: 20,
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
    top: 5,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(73, 77, 85, 0.57)",
    borderWidth: 1,
    borderColor: "white",
    padding: 2,
    borderRadius: 4,
    letterSpacing: -1,
  },
  discountPill: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 15,
  },
  discountPillText: { color: "#fff", fontSize: 13, fontWeight: "900" },

  infoWrapper: { padding: 12, justifyContent: "space-between", flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: "800", color: "#1e293b" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceStack: { flexDirection: "row", alignItems: "baseline" },
  sellPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#2b3da1ff",
    backgroundColor: "#4554ac23",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  originalPrice: {
    fontSize: 13,
    color: "#e61111ff",
    textDecorationLine: "line-through",
    marginLeft: 6,
    fontWeight: "700",
  },
  freeText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#10b981",
    backgroundColor: "#10b98123",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 5,
  },

  // actionBtn: {
  //   flexDirection: "row",
  //   // width: 28,
  //   // height: 28,
  //   padding:2,
  //   borderRadius: 8,
  //   backgroundColor: "#ffffffff",
  //   borderWidth:1,
  //   borderColor:"black",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  featureStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    marginTop: 8,
  },
  iconWrapper: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
});
