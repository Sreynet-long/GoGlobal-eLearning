import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function CourseDetail() {
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const stored = await AsyncStorage.getItem("enrolledCourses");
    const courses = stored ? JSON.parse(stored) : [];
    setCourse(courses.find((c) => c._id === courseId));
  };

  const increaseProgress = async () => {
    const stored = await AsyncStorage.getItem("enrolledCourses");
    const courses = stored ? JSON.parse(stored) : [];

    const updated = courses.map((c) =>
      c._id === courseId
        ? { ...c, progress: Math.min((c.progress || 0) + 10, 100) }
        : c
    );

    await AsyncStorage.setItem(
      "enrolledCourses",
      JSON.stringify(updated)
    );

    loadCourse();
  };

  if (!course) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {course.title}
      </Text>

      <Text>Progress: {course.progress}%</Text>

      <Button title="Complete Lesson (+10%)" onPress={increaseProgress} />
    </View>
  );
}
