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
const SLIDE_WIDTH = screenWidth - 32;
const AUTOSCROLL_INTERVAL = 4000;
const SCROLL_DELAY = 100;

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

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / SLIDE_WIDTH);
    setActiveIndex(newIndex);
  };

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
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={false}
      >
        {BANNER_DATA.map((item) => (
          <ImageBackground
            key={item.id}
            source={item.image}
            style={[styles.slide, { width: SLIDE_WIDTH }]}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.textOverlay}>
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
            style={[styles.dot, { opacity: index === activeIndex ? 1 : 0.5 }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 160,
    marginBottom: 15,
  },
  slide: {
    height: 160,
    justifyContent: "center",
    padding: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  textOverlay: {
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  slideButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  slideButtonText: {
    color: "#25375aff",
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
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default HeroBanner;
