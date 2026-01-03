import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Surface, Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  slate: "#475569",
  lightGrey: "#F1F5F9",
  border: "#E2E8F0",
};

export default function Notification({ badgeCount = 3, notifications }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notifItem} activeOpacity={0.6}>
      <View style={styles.notifIconContainer}>
        <View style={styles.iconCircle}>
          <MaterialIcons
            name="notifications-none"
            size={20}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.unreadDot} />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.notifHeaderRow}>
          <Text style={styles.notifTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notifTime}>2m ago</Text>
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.8}
        style={[styles.iconButton, open && styles.iconButtonActive]}
      >
        <MaterialIcons name="notifications" size={20} color={COLORS.white} />
        {/* {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 9 ? "9+" : badgeCount}
            </Text>
          </View>
        )} */}
      </TouchableOpacity>

      {open && (
        <>
         
          <TouchableOpacity
            style={styles.backdrop}
            onPress={toggleOpen}
            activeOpacity={1}
          />

          <Surface style={styles.dropdown} elevation={6}>
            <View style={styles.arrowUp} />

            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              <TouchableOpacity>
                <Text style={styles.markReadText}>Mark all as read</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <Divider style={styles.divider} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name="notifications-off"
                    size={40}
                    color={COLORS.slate}
                  />
                  <Text style={styles.emptyText}>No new notifications</Text>
                </View>
              }
            />

            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All Activities</Text>
            </TouchableOpacity>
          </Surface>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative", zIndex: 1000 },
  iconButton: {
    padding: 0,
    borderRadius: 14,
   
  },
  iconButtonActive: { backgroundColor: "rgba(255, 255, 255, 0.25)" },
  badge: {
    position: "absolute",
    top: 0,
    right: 1,
    backgroundColor: COLORS.accent,
    minWidth: 20,
    height: 20,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: { color: COLORS.primary, fontSize: 12, fontWeight: "900" },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "transparent",
    zIndex: 999,
  },

  dropdown: {
    position: "absolute",
    top: 55,
    right: -20,
    width: width * 0.95,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "visible",
    zIndex: 1000,
  },
  arrowUp: {
    position: "absolute",
    top: -10,
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.white,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  dropdownTitle: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  markReadText: { fontSize: 12, color: COLORS.accent, fontWeight: "700" },

  list: { maxHeight: 320 },
  notifItem: { flexDirection: "row", padding: 16, alignItems: "center" },
  notifIconContainer: { position: "relative", marginRight: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 9999,
  },
  textContainer: { flex: 1 },
  notifHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  notifTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  notifTime: { fontSize: 10, color: COLORS.slate, fontWeight: "500" },
  notifMessage: { fontSize: 13, color: COLORS.slate, lineHeight: 18 },

  divider: { backgroundColor: COLORS.lightGrey, height: 1 },
  viewAllBtn: {
    padding: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  viewAllText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },

  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { marginTop: 10, color: COLORS.slate, fontWeight: "600" },
});

Notification.defaultProps = {
  notifications: [
    {
      id: "1",
      title: "New Service Launch",
      message:
        "Check out our latest premium digital marketing tools available now.",
    },
    {
      id: "2",
      title: "Security Alert",
      message: "Your password was successfully changed from a new device.",
    },
    {
      id: "3",
      title: "Monthly Report",
      message: "Your analytics report for December 2024 is ready for viewing.",
    },
  ],
};
