import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface, Text } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
// import { uploadFiles } from "../../utils/uploadImage";
import UploadImage from "./GlobalUtils/UploadImage";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F1F5F9",
  white: "#FFFFFF",
  error: "#F43F5E",
  textDark: "#0F172A",
  grey600: "#475569",
  grey200: "#E2E8F0",
};

export default function AccountScreen() {
  const router = useRouter();
  const { language } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [fileUpload, setFileUpload] = useState([]);
  const mountedRef = useRef(true);

  const user = {
    __typename: "User",
    _id: "6944ae452c5bcb7e9231af17",
    createdAt: "2025-12-19T01:45:41.440Z",
    email: "sreynetlong168@gmail.com",
    first_name: "Sreyyyyy",
    gender: "female",
    is_enabled: true,
    last_name: "Net",
    phone_number: "098646489",
    profile_image: "1000001804__4d453764cee0491b0527134b72d5c014572a.jpg",
    remark: null,
    role: "mobile_user",
    updatedAt: "2026-01-19T09:17:20.046Z",
  };
  // console.log("userData", user);


  const handleBack = () => {
    if (router?.canGoBack()) router.back();
    else router.replace("/(tabs)/account&Aboutus");
  };

  function getGenderIcon(gender) {
    if (!gender) return "wc";
    const normalized = gender.toLowerCase();
    if (normalized === "male") return "male";
    if (normalized === "female") return "female";
    return "wc";
  }

  const avatarUri = null;

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerHero}>
        <View style={styles.avatarWrapper}>
          <Surface style={styles.avatarSurface} elevation={editing ? 8 : 2}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
            )}

            {editing && <UploadImage setFileUpload={setFileUpload} />}
          </Surface>
        </View>

        <Text style={styles.heroName}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.userEmailText}>{user?.email}</Text>
      </View>

      <View style={styles.contentBody}>
        <View style={styles.titleRow}>
          <Text style={styles.contentTitle}>
            {t("account_information", language)}
          </Text>

          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={[styles.editActionBtn, editing && styles.cancelActionBtn]}
          >
            <MaterialIcons
              name={editing ? "close" : "edit"}
              size={16}
              color={COLORS.white}
            />
            <Text style={styles.editActionText}>
              {editing
                ? t("cancel", language) || "Cancel"
                : t("edit_profile", language) || "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.infoGrid}>
            <InfoTile
              label={t("first_name", language)}
              value={user?.first_name}
              icon="account-box"
            />
            <InfoTile
              label={t("last_name", language)}
              value={user?.last_name}
              icon="badge"
            />
            <InfoTile
              label={t("phone", language)}
              value={user?.phone_number}
              icon="contact-phone"
            />
            <InfoTile
              label={t("gender", language)}
              value={user?.gender}
              icon={getGenderIcon(user?.gender)}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function InfoTile({ label, value, icon }) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileIconBg}>
        <MaterialIcons name={icon} size={30} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileValue}>{value || "-"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 25 : 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerHero: { paddingBottom: 30, alignItems: "center" },
  avatarWrapper: { marginBottom: 5 },
  avatarSurface: {
    width: 130,
    height: 130,
    borderRadius: 65,
    position: "relative",
    borderWidth: 5,
    borderColor: COLORS.accent,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 65 },
  heroName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  userEmailText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  editActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  cancelActionBtn: { backgroundColor: COLORS.error },
  editActionText: { color: COLORS.white, fontWeight: "800", fontSize: 13 },
  contentBody: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderTopWidth: 5,
    borderColor: COLORS.accent,
  },
  infoGrid: { marginBottom: 20 },
  tile: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grey200,
    marginBottom: 12,
  },
  tileIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.grey600,
    textTransform: "uppercase",
  },
  tileValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 2,
  },
  formContainer: { marginBottom: 20 },
  input: { backgroundColor: COLORS.white, borderRadius: 10 },
  inputContent: { paddingVertical: 10, paddingHorizontal: 15 },
  genderBox: { marginTop: 0 },
  genderLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.grey600,
    marginBottom: 12,
  },
  radioGroup: { flexDirection: "row" },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  genderOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#F0F4FF",
  },
  genderText: { fontWeight: "600", color: COLORS.grey600 },
  genderTextActive: { color: COLORS.primary },
  saveBtn: {
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 7,
    fontWeight: "800",
  },
});
