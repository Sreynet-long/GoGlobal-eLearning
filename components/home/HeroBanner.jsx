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

const { width: screenWidth } = Dimensions.get("window");
const SLIDE_WIDTH = screenWidth - 32;
const AUTOSCROLL_INTERVAL = 4000;
const SCROLL_DELAY = 100;

const BANNER_DATA = [
  {
    id: 1,
    title: "Tech Skills",
    subtitle: "Explore All 240+ Courses",
    image: require("../../assets/banners/tech-skill.png"),
  },
  {
    id: 2,
    title: "50% OFF SALE!",
    subtitle: "On All Cloud Certifications until Friday.",
    image: require("../../assets/banners/sale-off.png"),
  },
  {
    id: 3,
    title: "NEW: C++ Class",
    subtitle: "Beginner to Advanced in 8 Weeks.",
    image: require("../../assets/banners/cpp.png"),
  },
];

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / SLIDE_WIDTH);
    setActiveIndex(newIndex);
  };

  // to handle the auto-scrolling
  const autoScroll = () => {
    // calculate potition of the next slide
    const nextIndex = (activeIndex + 1) % BANNER_DATA.length;
    const xOffset = nextIndex * SLIDE_WIDTH;

    // Use a slight delay before calling scrollTo to give the "pause" effect
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: xOffset,
        animated: true,
      });
      // Update the index state
      setActiveIndex(nextIndex);
    }, SCROLL_DELAY);
  };

  useEffect(() => {
    // Set the interval for auto-scrolling
    const interval = setInterval(() => {
      autoScroll();
    }, AUTOSCROLL_INTERVAL);

    // clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [activeIndex]);
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
        {BANNER_DATA.map((item, index) => (
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
                <Text style={styles.slideButtonText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
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
    height: "160",
    justifyContent: "center",
    padding: 20,
    borderRadius: 12,
    overflow: "hidden"
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
