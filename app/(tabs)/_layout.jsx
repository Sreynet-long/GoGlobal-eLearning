import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function TabsLayout() {
  const { isAuth } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: { backgroundColor: "#25375aff", borderTopWidth: 0 },
        tabBarLabelStyle: { fontWeight: "600", fontSize: 12 },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color={color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
        }}
      />

      {/* Courses */}
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="book-education"
                size={24}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="book-education-outline"
                size={24}
                color={color}
              />
            ),
        }}
      />

      {/* My Courses (AUTH ONLY) */}
      {isAuth && (
        <Tabs.Screen
          name="myCourses"
          options={{
            title: "My Courses",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="book-heart"
                  size={24}
                  color={color}
                />
              ) : (
                <MaterialCommunityIcons
                  name="book-heart-outline"
                  size={24}
                  color={color}
                />
              ),
          }}
        />
      )}

      <Tabs.Screen
        name="account"
        options={{
          title: isAuth ? "Account" : "Login",
          tabBarIcon: ({ color, focused }) =>
            isAuth ? (
              focused ? (
                <FontAwesome6 name="user-graduate" size={22} color={color} />
              ) : (
                <FontAwesome6 name="user-large" size={21} color={color} />
              )
            ) : focused ? (
              <Ionicons name="log-in" size={28} color={color} />
            ) : (
              <Ionicons name="log-in-outline" size={28} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
