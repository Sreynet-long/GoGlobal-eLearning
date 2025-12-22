import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
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
        tabBarActiveTintColor: "#25375A", 
        tabBarInactiveTintColor: "#94a3b8", 
        tabBarStyle: {
          backgroundColor: "#ffffff",
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          height: 75,
          borderRadius: 24, 
          paddingBottom: 12,
          paddingTop: 10,
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
          textTransform: 'capitalize', 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home", language),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <FontAwesome6 name={focused ? "house-chimney" : "house"} size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: t("courses", language),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              <MaterialCommunityIcons 
                name={focused ? "book-open-page-variant" : "book-education"} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="myCourses&Login"
        options={{
          title: isAuth ? t("my_courses", language) : t("login", language),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              {isAuth ? (
                <MaterialCommunityIcons 
                  name={focused ? "book-open-page-variant" : "book-heart"} 
                  size={24} 
                  color={color} 
                />
              ) : (
                <FontAwesome5 name={focused ? "door-open" : "door-closed"} size={20} color={color} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="account&Aboutus"
        options={{
          title: isAuth ? t("account", language) : t("about_us", language),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : styles.inactiveTab}>
              {isAuth ? (
                <FontAwesome6 name={focused ? "user-graduate" : "user-large"} size={20} color={color} />
              ) : (
                <FontAwesome name={focused ? "question-circle" : "question-circle-o"} size={22} color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#25375A10', 
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 2, 
  },
  inactiveTab: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 2,
  }
});