import { useQuery } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { FILE_BASE_URL } from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_USER_BY_ID } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#E11D48",
  grey50: "#F8FAFC",
  grey100: "#F1F5F9",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  textDark: "#1E293B",
};

export default function AccountScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user: authUser, logout } = useAuth();

  const { data: userData, loading: userLoading } = useQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
  });

  const user = userData?.getUserById || authUser || {};

  if (userLoading) return null;

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerWrapper}>
        <Topbar />
        <View style={styles.profileCard}>
          <Surface style={styles.avatarSurface} elevation={4}>
            <Image
              source={{
                uri: user?.profile_image
                  ? `${FILE_BASE_URL}/file/${user.profile_image}`
                  : null,
              }}
              style={styles.avatar}
            />
          </Surface>

          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <View style={styles.emailBadge}>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.accentBackgroundLayer}>
        <Surface style={styles.contentContainer} elevation={0}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.menuTitle}>
              {t("personal_details", language)}
            </Text>

            <View style={styles.menuGrid}>
              <MenuItem
                label={t("account_information", language)}
                icon="manage-accounts"
                onPress={() => router.push("/auth/account-information")}
              />
              <MenuItem
                label={t("change_password", language)}
                icon="lock-person"
                onPress={() => router.push("/auth/change-password")}
              />
              <MenuItem
                label={t("about_us", language)}
                icon="help"
                onPress={() => router.push("/auth/about-us")}
              />
              <MenuItem
                label={t("contact_us", language)}
                icon="support-agent"
                onPress={() => router.push("/auth/contact-us")}
              />
              <MenuItem
                label={t("terms_conditions", language)}
                icon="description"
                onPress={() => router.push("/auth/terms-conditions")}
                isLast
              />
            </View>

            <Button
              mode="contained"
              onPress={logout}
              style={styles.logoutButton}
              labelStyle={styles.logoutLabel}
              contentStyle={styles.logoutContent}
            >
              {t("log_out", language)}
            </Button>

            <Text style={styles.versionText}>
              {t("version_tag", language, { version: "1.0.0", build: "22" })}
            </Text>
          </ScrollView>
        </Surface>
      </View>
    </View>
  );
}

function MenuItem({ label, icon, onPress, isLast }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconBox}>
        <MaterialIcons name={icon} size={30} color={COLORS.primary} />
      </View>
      <Text style={styles.menuLabel}>{String(label)}</Text>

      <MaterialIcons name="chevron-right" size={24} color={COLORS.grey200} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  headerWrapper: {
    paddingBottom: 25,
  },
  profileCard: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarSurface: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    borderWidth: 4,
    borderColor: COLORS.accent,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    marginTop: 12,
    letterSpacing: -0.5,
  },
  emailBadge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  userEmail: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
  },

  accentBackgroundLayer: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.grey50,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 6,
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 90,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 20,
    textAlign: "center",
  },
  menuGrid: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.grey100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 16,
    marginTop: 10,
    elevation: 0,
  },
  logoutContent: {
    height: 54,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  versionText: {
    textAlign: "center",
    color: COLORS.grey600,
    fontSize: 11,
    marginTop: 20,
    opacity: 0.7,
  },
});
