import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
<<<<<<< HEAD
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
=======
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
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
        tabBarShowLabel: true,
<<<<<<< HEAD
        tabBarActiveTintColor: "#ffffff",
=======
        tabBarActiveTintColor: "#25375A",
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#14213bff",
          position: "absolute",
<<<<<<< HEAD
          bottom: 40,
          marginHorizontal:15,
          left: 40,
          right: 40,
          height: 65,
          borderRadius: 24,
          paddingBottom: 2,
          paddingTop: 5,
=======
          bottom: 25,
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 24,
          paddingBottom: 12,
          paddingTop: 10,
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
          borderWidth: 1,
          borderColor: "#f1f5f9",
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
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: t("home", language),
          tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
            <FontAwesome6
              name={focused ? "house-chimney" : "house"}
              size={25}
=======
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={24}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
              color={color}
            />
          ),
        }}
      />
<<<<<<< HEAD
=======

      {/* Courses */}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
      <Tabs.Screen
        name="courses"
        options={{
          title: t("courses", language),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "book-open-page-variant" : "book-education"}
<<<<<<< HEAD
              size={30}
=======
              size={24}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
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
<<<<<<< HEAD
                size={30}
=======
                size={24}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
                color={color}
              />
            ) : (
              <FontAwesome5
                name={focused ? "door-open" : "door-closed"}
<<<<<<< HEAD
                size={25}
=======
                size={22}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
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
<<<<<<< HEAD
                name={focused ? "user-graduate" : "user-alt"}
                size={25}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name={focused ? "book-open-page-variant" : "book-information-variant"}
                size={30}
=======
                name={focused ? "user-graduate" : "user"}
                size={22}
                color={color}
              />
            ) : (
              <FontAwesome
                name={focused ? "question-circle" : "question-circle-o"}
                size={22}
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}

<<<<<<< HEAD

=======
>>>>>>> 3f7d2b5201dc8a6c3989f99950cfb256bedf66e6
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
