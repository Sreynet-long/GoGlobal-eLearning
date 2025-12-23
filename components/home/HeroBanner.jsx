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
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const { width: screenWidth } = Dimensions.get("window");
const SLIDE_MARGIN = 16;
const SLIDE_WIDTH = screenWidth - SLIDE_MARGIN * 2;
const AUTOSCROLL_INTERVAL = 4000;

const HeroBanner = () => {
  const { language } = useLanguage();

  const BANNER_DATA = [
    {
      id: 1,
      title: t("tech_skill", language),
      subtitle: t("explore_courses", language),
      image: require("../../assets/banners/tech-skill.png"),
    },
    {
      id: 2,
      title: t("50_off_sale", language),
      subtitle: t("cloud_sale_subtitle", language),
      image: require("../../assets/banners/sale-off.png"),
    },
    {
      id: 3,
      title: t("new_c_class", language),
      subtitle: t("cpp_subtitle", language),
      image: require("../../assets/banners/cpp.png"),
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % BANNER_DATA.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * SLIDE_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, AUTOSCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, BANNER_DATA.length]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={true} // Auto-scroll only
        showsHorizontalScrollIndicator={false}
      >
        {BANNER_DATA.map((item) => (
          <ImageBackground
            key={item.id}
            source={item.image}
            style={[styles.slide, { width: SLIDE_WIDTH }]}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.gradientOverlay}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.slideButton}>
                <Text style={styles.slideButtonText}>
                  {t("explore_now", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {BANNER_DATA.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 5,
    height: 200,
  },
  slide: {
    height: 200,
    // marginHorizontal: SLIDE_MARGIN / 2,
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
