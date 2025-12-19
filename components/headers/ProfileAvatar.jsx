import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProfileAvatar = ({
  initials,
  size = 40,
  source,
  hasNotifications = false,
  onPress,
  backgroundColor = "#FFFFFF",
  initialsColor = "#25375aff",
}) => {
  const showImage = source && typeof source === "object" && source.uri;

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: showImage ? "transparent" : backgroundColor,
    },
  ];

  const content = showImage ? (
    <Image
      source={source}
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      resizeMode="cover"
    />
  ) : (
    <Text
      style={[
        styles.initialsText,
        { fontSize: size * 0.4, color: initialsColor },
      ]}
    >
      {initials ? initials.toUpperCase().substring(0, 2) : "?"}
    </Text>
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={!onPress}
    >
      {content}

      {hasNotifications && <View style={styles.badge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {},
  initialsText: {
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});

export default ProfileAvatar;
