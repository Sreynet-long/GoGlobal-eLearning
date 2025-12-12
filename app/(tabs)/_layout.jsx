import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#25375aff",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
      }}
    >
      <Ionicons name="home" size={24} color="black" />
      <Ionicons name="home-outline" size={24} color="black" />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home Page",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <Ionicons name="home" size={24} color={color} />
            ) : (
              <Ionicons name="home-outline" size={24} color={color} />
            );
          },
        }}
      />
      <MaterialIcons name="menu-book" size={24} color="black" />
      <Foundation name="book-bookmark" size={24} color="black" />
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <MaterialIcons name="menu-book" size={24} color={color} />
            ) : (
              <Foundation name="book-bookmark" size={24} color={color} />
            );
          },
        }}
      />
      <Ionicons name="log-in-outline" size={24} color="black" />
      <Ionicons name="log-in" size={24} color="black" />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <Ionicons name="log-in" size={28} color={color} />
            ) : (
              <Ionicons name="log-in-outline" size={28} color={color} />
            );
          },
        }}
      />

      <Ionicons name="bookmarks" size={24} color="black" />
      <Ionicons name="bookmarks-outline" size={24} color="black" />
      <Tabs.Screen
        name="myCourses"
        options={{
          title: "My courses",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <Ionicons name="bookmarks" size={22} color={color} />
            ) : (
              <Ionicons name="bookmarks-outline" size={22} color={color} />
            );
          },
        }}
      />
      <FontAwesome6 name="user-large" size={24} color="black" />
      <FontAwesome6 name="user-graduate" size={24} color="black" />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <FontAwesome6 name="user-graduate" size={22} color={color} />
            ) : (
              <FontAwesome6 name="user-large" size={21} color={color} />
            );
          },
        }}
      />
    </Tabs>
  );
}
