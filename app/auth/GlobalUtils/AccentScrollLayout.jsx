import { ScrollView } from "react-native";

export default function AccentScrollLayout({ children }) {
  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
    >
      {children}
    </ScrollView>
  );
}
