import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_BANNER_WITH_PAGINATION } from "../../schema/courseHomepage";

const { width: screenWidth } = Dimensions.get("window");
const SLIDE_MARGIN = 16;
const SLIDE_WIDTH = screenWidth - SLIDE_MARGIN * 2;
const AUTOSCROLL_INTERVAL = 4000;

const HeroBanner = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, loading } = useQuery(GET_COURSE_BANNER_WITH_PAGINATION, {
    variables: {
      page: 1,
      limit: 10,
      pagination: false,
      isPublic: true,
    },
    fetchPolicy: "cache-and-network",
  });

  const banners = data?.getCoverSliderPagination?.data ?? [];

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
<<<<<<< HEAD
      const nextIndex = (activeIndex + 1) % banners.length;
=======
      const nextIndex = (activeIndex + 1) % BANNER_DATA.length;
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
      scrollRef.current?.scrollTo({
        x: nextIndex * SLIDE_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, AUTOSCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  if (loading || !banners.length) {
    return null;
  }

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
<<<<<<< HEAD
=======
        scrollEnabled={true} // Auto-scroll only
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          const index = Math.round(x / SLIDE_WIDTH);
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {banners.map((item) => (
          <ImageBackground
            key={item._id}
            source={{
              uri: item.image?.startsWith("http")
                ? item.image
                : `${IMAGE_BASE_URL}/file/${item.image}`,
            }}
            style={[styles.slide, { width: SLIDE_WIDTH }]}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.gradientOverlay}>
              <Text style={styles.slideTitle}>{item.title}</Text>

              <Text style={styles.slideSubtitle}>
                {item.description || t("explore_courses", language)}
              </Text>

              <TouchableOpacity
                style={styles.slideButton}
                onPress={() => router.push("/(tabs)/courses")}
              >
                <Text style={styles.slideButtonText}>
                  {t("explore_now", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

//==================== Styles ====================

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 5,
    height: 200,
  },
  slide: {
    height: 200,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gradientOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
  },
  slideButton: {
    backgroundColor: "#ffffffff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  slideButtonText: {
    color: "#25375A",
    fontWeight: "bold",
    fontSize: 14,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3fe947ff",
    opacity: 1,
  },
});

export default HeroBanner;
