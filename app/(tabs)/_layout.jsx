import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Tabs } from "expo-router";
import { Platform, StyleSheet, StatusBar} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
const NAVIGATION_HEIGHT = Platform.OS === "ios" ? 40 : (StatusBar.currentHeight || 0) + -5;

export default function TabsLayout() {
  const { isAuth } = useAuth();
  const { language } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#86909eff",
        tabBarStyle: {
          backgroundColor: "#25375A",
          position: "absolute",
          bottom: NAVIGATION_HEIGHT,
          marginHorizontal:15,
          left: 40,
          right: 40,
          height: 65,
          borderRadius: 16,
          paddingBottom: 2,
          paddingTop: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
          borderWidth: 3,
          borderColor: "#D4AF37",
          ...Platform.select({
            ios: { borderTopWidth: 0 },
            android: { borderTopWidth: 0 },
          }),
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 10,
          marginTop: 2,
          textTransform: "capitalize",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home", language),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name={focused ? "house-chimney" : "house"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: t("courses", language),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "book-open-page-variant" : "book-education"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myCourses&Login"
        options={{
          title: isAuth ? t("my_courses", language) : t("login", language),
          tabBarIcon: ({ color, focused }) =>
            isAuth ? (
              <MaterialCommunityIcons
                name={focused ? "book-open-page-variant" : "book-heart"}
                size={30}
                color={color}
              />
            ) : (
              <FontAwesome5
                name={focused ? "door-open" : "door-closed"}
                size={25}
                color={color}
              />
            ),
        }}
      />

      <Tabs.Screen
        name="account&Aboutus"
        options={{
          title: isAuth ? t("account", language) : t("about_us", language),
          tabBarIcon: ({ color, focused }) =>
            isAuth ? (
              <FontAwesome5
                name={focused ? "user-graduate" : "user-alt"}
                size={25}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name={focused ? "book-open-page-variant" : "book-information-variant"}
                size={30}
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}

//==================== Styles ====================

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: "#25375A10",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 2,
  },
  inactiveTab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 2,
  },
});
