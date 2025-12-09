import { Tabs } from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';


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
            fontWeight:"600",
            fontSize: 12,
        }
        }}
    >
        <Tabs.Screen 
            name="index"
            options={{
                title: "Home",
                tabBarIcon: ({ focused }) => {
                    return (
                        <Octicons name="home-fill" size={24} color={focused ? "white" : "gray"} />
                    );
                },
            }}
        />
        <Tabs.Screen 
            name="course"
            options={{
                title: "Course",
                tabBarIcon: ({focused}) => {
                    return (
                        <MaterialCommunityIcons name="book-open-page-variant" size={24} color={focused ? "white" : "gray"} />
                    );
                },
            }}
        />
        <Tabs
            name="help"
            options={{
                title: "Help"
            }}
        />
        <Tabs.Screen 
            name="login"
            options={{
                title: "Login",
                tabBarIcon: ({focused}) => {
                    return (
                        <SimpleLineIcons name="login" size={24} color={focused ? "white" : "gray"} />
                    );
                },
            }}
        />
    </Tabs>
  )
}