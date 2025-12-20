import { useMutation, useQuery } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_USER_BY_ID, MOBILE_UPDATE_USER } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F7F9FC",
  white: "#FFFFFF",
  error: "#D32F2F",
  textDark: "#212121",
  textLight: "#FFFFFF",
  grey300: "#E0E0E0",
  grey600: "#757575",
  cardBackground: "#FFFFFF",
  borderLight: "#e9ecef",
};

const UPLOAD_API = "http://192.168.5.36:6800/api/direct-upload/";
const FILE_BASE_URL = "http://192.168.5.36:6800/api/file/";

export default function AccountScreen() {
  const { language } = useLanguage();
  const { user: authUser, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [localProfileImage, setLocalProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const loadProfileImage = async () => {
      const cached = await AsyncStorage.getItem("localProfileImage");
      if (cached) setLocalProfileImage(cached);
    };
    loadProfileImage();
  }, []);

  const {
    data: userData,
    refetch,
    loading: userLoading,
  } = useQuery(GET_USER_BY_ID, { fetchPolicy: "network-only" });

  const [updateUser, { loading: updating }] = useMutation(MOBILE_UPDATE_USER, {
    onCompleted: (data) => {
      refetch?.();
      setEditing(false);
      if (data?.mobileUpdateUser?.data) setUser(data.mobileUpdateUser.data);
    },
    onError: (err) => console.error(err),
  });

  const user = userData?.getUserById || authUser || {};

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalProfileImage(uri);
      await AsyncStorage.setItem("localProfileImage", uri);
    }
  };

  const uploadFiles = async (fileUri) => {
    try {
      if (!fileUri) return null;
      const formData = new FormData();
      const uri = fileUri.startsWith("file://") ? fileUri : "file://" + fileUri;
      formData.append("files", {
        uri,
        name: uri.split("/").pop(),
        type: "image/jpeg",
      });
      const response = await fetch(UPLOAD_API, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      return result?.files?.[0]?.filename || null;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleSave = async (formData) => {
    let profileImageFilename = user.profile_image || "";
    if (localProfileImage && !localProfileImage.startsWith("http")) {
      const uploaded = await uploadFiles(localProfileImage);
      if (uploaded) profileImageFilename = uploaded;
    }
    updateUser({
      variables: {
        id: user._id,
        input: { ...formData, profile_image: profileImageFilename },
      },
    });
  };

  if (userLoading) return null;

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.headerBackground}>
        <Topbar />
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: localProfileImage
                  ? localProfileImage
                  : user?.profile_image
                  ? FILE_BASE_URL + user.profile_image
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
            {editing && (
              <TouchableOpacity style={styles.cameraBadge} onPress={pickImage}>
                <MaterialIcons
                  name="photo-camera"
                  size={18}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userNameText}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmailText}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              setActiveTab("account");
            }}
            style={[
              styles.segmentBtn,
              activeTab === "account" && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "account" && styles.segmentTextActive,
              ]}
            >
              {t("account_information", language)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              setActiveTab("security");
            }}
            style={[
              styles.segmentBtn,
              activeTab === "security" && styles.segmentBtnActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "security" && styles.segmentTextActive,
              ]}
            >
              {t("security", language)}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "account"
                ? t("personal_details", language)
                : t("settings", language)}
            </Text>
            {activeTab === "account" && (
              <TouchableOpacity onPress={() => setEditing(!editing)}>
                <Text style={styles.editActionText}>
                  {editing
                    ? t("cancel", language)
                    : t("edit_profile", language)}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {activeTab === "account" ? (
            <AccountDetailsView
              user={user}
              editing={editing}
              handleSave={handleSave}
              updating={updating}
              language={language}
              pickImage={pickImage}
              logout={logout}
            />
          ) : (
            <SecurityView language={language} logout={logout} />
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function AccountDetailsView({
  user,
  editing,
  handleSave,
  updating,
  language,
  logout,
}) {
  if (editing) {
    return (
      <EditUser
        initialData={user}
        onSave={handleSave}
        updating={updating}
        language={language}
      />
    );
  }
  return (
    <View>
      <InfoRow
        label={t("first_name", language)}
        value={user?.first_name}
        icon="person"
      />
      <InfoRow
        label={t("last_name", language)}
        value={user?.last_name}
        icon="badge"
      />
      <InfoRow
        label={t("phone", language)}
        value={user?.phone_number}
        icon="smartphone"
      />
      <InfoRow label={t("gender", language)} value={user?.gender} icon="face" />
      <Button
        mode="contained"
        onPress={logout}
        style={styles.logoutBtn}
        labelStyle={{ fontWeight: "700" }}
      >
        {t("log_out", language)}
      </Button>
    </View>
  );
}

function SecurityView({ language, logout }) {
  const items = [
    { key: "1", label: t("change_password", language), icon: "lock-reset" },
    { key: "2", label: t("about_us", language), icon: "corporate-fare" },
    { key: "3", label: t("contact_us", language), icon: "support-agent" },
    { key: "4", label: t("terms_conditions", language), icon: "gavel" },
  ];
  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity key={item.key} style={styles.securityRow}>
          <View style={styles.securityIconBox}>
            <MaterialIcons name={item.icon} size={22} color={COLORS.primary} />
          </View>
          <Text style={styles.securityLabel}>{item.label}</Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={COLORS.grey300}
          />
        </TouchableOpacity>
      ))}
      <Button mode="contained" onPress={logout} style={styles.logoutBtn}>
        {t("log_out", language)}
      </Button>
    </View>
  );
}

function EditUser({ initialData, onSave, updating, language }) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    phone_number: initialData.phone_number || "",
    gender: initialData.gender || "male",
  });

  return (
    <View style={styles.editForm}>
      <View style={styles.row}>
        <TextInput
          label={t("first_name", language)}
          value={formData.first_name}
          onChangeText={(v) => setFormData({ ...formData, first_name: v })}
          style={[styles.input, { marginRight: 8 }]}
          mode="outlined"
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          label={t("last_name", language)}
          value={formData.last_name}
          onChangeText={(v) => setFormData({ ...formData, last_name: v })}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={COLORS.primary}
        />
      </View>
      <TextInput
        label={t("phone", language)}
        value={formData.phone_number}
        onChangeText={(v) => setFormData({ ...formData, phone_number: v })}
        style={styles.fullInput}
        mode="outlined"
        keyboardType="phone-pad"
        activeOutlineColor={COLORS.primary}
      />
      <View style={styles.radioContainer}>
        <RadioButton.Group
          onValueChange={(val) => setFormData({ ...formData, gender: val })}
          value={formData.gender}
        >
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="male" color={COLORS.primary} />
              <Text>{t("male", language)}</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="female" color={COLORS.primary} />
              <Text>{t("female", language)}</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <Button
        mode="contained"
        loading={updating}
        onPress={() => onSave(formData)}
        style={styles.saveBtn}
      >
        {t("save_changes", language)}
      </Button>
    </View>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <MaterialIcons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  headerBackground: { paddingBottom: 50 },
  profileSection: { alignItems: "center", marginTop: 20 },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 6,
    elevation: 5,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 10,
  },
  userEmailText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    padding: 4,
    marginTop: -25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentBtnActive: { backgroundColor: COLORS.white },
  segmentText: { fontWeight: "600", color: COLORS.grey600 },
  segmentTextActive: { color: COLORS.primary },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.primary },
  editActionText: { color: COLORS.accent, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(37, 55, 90, 0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoTextContainer: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    color: COLORS.grey600,
    textTransform: "uppercase",
  },
  infoValue: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  securityIconBox: { marginRight: 15 },
  securityLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 5,
  },
  editForm: { marginTop: 5 },
  row: { flexDirection: "row", marginBottom: 12 },
  input: { flex: 1, backgroundColor: COLORS.white },
  fullInput: { marginBottom: 12, backgroundColor: COLORS.white },
  radioContainer: { marginVertical: 10 },
  radioRow: { flexDirection: "row", justifyContent: "space-around" },
  radioItem: { flexDirection: "row", alignItems: "center" },
  saveBtn: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 5,
  },
});
