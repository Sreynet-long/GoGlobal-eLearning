import { View, Text, Divider, StyleSheet } from 'react-native'
import React from 'react'

export default function CourseMultilineSection({ title, value }){
  if (!value || value.trim() === "") return null;

  const lines = value
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <View style={styles.sectionBox}>
      <Text style={styles.includesTitle}>{title}</Text>
      <Divider style={{ marginVertical: 8 }} />

      {lines.map((line, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.sectionText}>{line}</Text>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
    sectionBox: {
  marginTop: 20,
  backgroundColor: "#F9F9F9",
  padding: 15,
  borderRadius: 12,
},

sectionText: {
  fontSize: 14,
  color: "#444",
  lineHeight: 20,
  fontWeight: "500",
  flex: 1,
},

bulletRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 6,
},

bullet: {
  marginRight: 8,
  fontSize: 16,
  lineHeight: 20,
  color: "#3F51B5",
},

})