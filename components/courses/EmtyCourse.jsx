import { Image, Text, View } from "react-native";

export default function EmtyCourse() {
  return (
    <View>
      <Image
        source={require("../../assets/images/find-course.png")}
        style={{ marginTop: 100, width: 60, height: 60, alignSelf: "center" }}
      />
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No courses enrolled in this category.
      </Text>
    </View>
  );
}
