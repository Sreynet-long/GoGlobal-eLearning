import { Text, StyleSheet, View } from "react-native";

export default function ParagraphList({ text }) {
  if (!text) return null;

  return (
    <View>
      {text
        .split("\n")
        .filter(line => line.trim() !== "")
        .map((line, index) => (
          <Text key={index} style={styles.item}>
            • {line}
          </Text>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
    color: "#444",
  },
});
