import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import EnrolledCourses from "../../components/courses/EnrolledCourses";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";

export default function MyCourses() {
  const { isAuth, loading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!loading && !isAuth) router.replace("/account");
  }, [isAuth, loading]);

  if (loading || !isAuth) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#25375aff" }}>
      <Topbar />
      <View
        style={{
          flex: 1,
          overflow: "hidden",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "white",
        }}
      >
        <Search />
        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <FeatureCategory onSelectedCategory={setSelectedCategory} />
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        >
          <EnrolledCourses selectedCategory={selectedCategory} />
        </ScrollView>
      </View>
    </View>
  );
}
