import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function TabsLayout() {
  const { isAuth } = useAuth();
  const { language } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#25375aff",
          position: "absolute",
          bottom: 35,
          left: 15,
          right: 15,
          height: 60,
          borderRadius: 50,
          elevation: 0,
          shadowOpacity: 0,
          marginRight: 10,
          marginLeft: 10,
        },
        tabBarLabelStyle: { fontWeight: "600", fontSize: 12 },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home", language),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome6 name="house-chimney" size={23} color={color} />
            ) : (
              <FontAwesome6 name="house" size={23} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: t("courses", language),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={24}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="book-education"
                size={24}
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
              focused ? (
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={24}
                  color={color}
                />
              ) : (
                <MaterialCommunityIcons
                  name="book-heart"
                  size={24}
                  color={color}
                />
              )
            ) : focused ? (
              <FontAwesome5 name="door-open" size={22} color={color} />
            ) : (
              <FontAwesome5 name="door-closed" size={22} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="account&Aboutus"
        options={{
          title: isAuth ? t("account", language) : t("about_us", language),
          tabBarIcon: ({ color, focused }) =>
            isAuth ? (
              focused ? (
                <FontAwesome6 name="user-graduate" size={22} color={color} />
              ) : (
                <FontAwesome6 name="user-large" size={21} color={color} />
              )
            ) : focused ? (
              <FontAwesome name="question-circle" size={24} color={color} />
            ) : (
              <FontAwesome name="question-circle-o" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
