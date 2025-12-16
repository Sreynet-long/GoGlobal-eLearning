import FontAwesome from "@expo/vector-icons/FontAwesome";
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
      {/* <Tabs.Screen
        name="about"
        options={{
          title: "About Us",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              
            ) : (
              
            ),
        }}
      /> */}

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
      <Tabs.Screen
        name="myCourses&Login"
        options={{
          title: isAuth ? "My Courses" : "Login",
          tabBarIcon: ({ color, focused }) =>
            isAuth ? (
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
              )
            ) : focused ? (
              <Ionicons name="log-in" size={28} color={color} />
            ) : (
              <Ionicons name="log-in-outline" size={28} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="account&Aboutus"
        options={{
          title: isAuth ? "Account" : "About Us",
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
