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
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
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

export default function AccountScreen() {
  const theme = useTheme();
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

  if (userLoading) return null;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalProfileImage(uri);
      await AsyncStorage.setItem("localProfileImage", uri);
    }
  };

  const handleSave = (formData) => {
    setEditing(false);
    updateUser({
      variables: {
        id: user._id,
        input: {
          ...formData,
          profile_image: localProfileImage || user.profile_image || "",
        },
      },
    });
  };

  const handleTabChange = (tab) => {
    if (editing) setEditing(false);
    setActiveTab(tab);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Topbar />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                localProfileImage ||
                user?.profile_image ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

          <Button
            mode="text"
            textColor={COLORS.primary}
            labelStyle={styles.editButtonLabel}
            onPress={() => setEditing(!editing)}
          >
            {editing ? t("cancel", language) : t("edit_profile", language)}
          </Button>
        </View>

        <View style={styles.tabHeader}>
          <TouchableOpacity
            onPress={() => handleTabChange("account")}
            style={[
              styles.tabButton,
              activeTab === "account" && styles.activeTab,
            ]}
          >
            <Text style={styles.tabText}>
              {t("account_information", language)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange("security")}
            style={[
              styles.tabButton,
              activeTab === "security" && styles.activeTab,
            ]}
          >
            <Text style={styles.tabText}>{t("security", language)}</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "account" ? (
          <AccountDetailsView
            user={user}
            editing={editing}
            setEditing={setEditing}
            handleSave={handleSave}
            updating={updating}
            language={language}
            pickImage={pickImage}
            localProfileImage={localProfileImage}
            logout={logout}
          />
        ) : (
          <SecurityView language={language} logout={logout} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

//==================== Account Details ====================
function AccountDetailsView({
  user,
  editing,
  setEditing,
  handleSave,
  updating,
  language,
  pickImage,
  localProfileImage,
  logout,
}) {
  return (
    <View>
      <Card style={styles.infoCard}>
        <Card.Content>
          {editing ? (
            <EditUser
              initialData={user}
              onSave={handleSave}
              updating={updating}
              language={language}
              pickImage={pickImage}
              localProfileImage={localProfileImage}
            />
          ) : (
            <>
              <InfoRow
                label={t("first_name", language)}
                value={user?.first_name}
                icon="person"
              />
              <InfoRow
                label={t("last_name", language)}
                value={user?.last_name}
                icon="person-outline"
              />
              <InfoRow
                label={t("phone", language)}
                value={user?.phone_number}
                icon="phone"
              />
              <InfoRow
                label={t("gender", language)}
                value={user?.gender}
                icon="wc"
              />
            </>
          )}
        </Card.Content>
        {!editing && (
          <Button
            mode="contained"
            onPress={logout}
            style={styles.logoutButtonContained}
            textColor={COLORS.white}
          >
            {t("log_out", language)}
          </Button>
        )}
      </Card>
    </View>
  );
}

//==================== Security View ====================
function SecurityView({ language, logout }) {
  const securityItems = [
    {
      key: "change_password",
      label: t("change_password", language),
      icon: "lock",
      onPress: () => {
        navigation.navigate("auth/update-password");
      },
    },
    {
      key: "about_us",
      label: t("about_us", language),
      icon: "info-outline",
      onPress: () => {
        // navigation.navigate("AboutUs");
      },
    },
    {
      key: "contact_us",
      label: t("contact_us", language),
      icon: "phone",
      onPress: () => {
      },
    },
    {
      key: "terms_conditions",
      label: t("terms_conditions", language),
      icon: "description", 
      onPress: () => {
        // navigation.navigate("TermsConditions");
      },
    },
  ];

  return (
    <View>
      <Card style={styles.infoCard}>
        {securityItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.securityItem}
            onPress={item.onPress}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={COLORS.grey600}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.infoLabel}>{item.label}</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={COLORS.grey600}
            />
          </TouchableOpacity>
        ))}

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButtonContained}
          textColor={COLORS.white}
        >
          {t("log_out", language)}
        </Button>
      </Card>
    </View>
  );
}

//==================== Edit User ====================
function EditUser({
  initialData,
  onSave,
  updating,
  language,
  pickImage,
  localProfileImage,
}) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    phone_number: initialData.phone_number || "",
    gender: initialData.gender || "male",
  });

  return (
    <View style={styles.infoCardEdit}>
      <View style={styles.row}>
        <TextInput
          label={t("first_name", language)}
          value={formData.first_name}
          onChangeText={(text) =>
            setFormData({ ...formData, first_name: text })
          }
          mode="flat"
          style={[styles.inputField, { flex: 1, marginRight: 5 }]}
          autoFocus
        />
        <TextInput
          label={t("last_name", language)}
          value={formData.last_name}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          mode="flat"
          style={[styles.inputField, { flex: 1, marginLeft: 5 }]}
        />
      </View>

      <TextInput
        label={t("phone", language)}
        value={formData.phone_number}
        onChangeText={(text) =>
          setFormData({ ...formData, phone_number: text })
        }
        mode="flat"
        style={styles.inputField}
        keyboardType="phone-pad"
      />

      <RadioButton.Group
        onValueChange={(val) => setFormData({ ...formData, gender: val })}
        value={formData.gender}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            // marginVertical: 10,
            justifyContent: "center",
          }}
        >
          <RadioButton.Item label={t("male", language)} value="male" />
          <RadioButton.Item label={t("female", language)} value="female" />
        </View>
      </RadioButton.Group>

      {/* <View style={styles.buttonRow}> */}
      <Button
        mode="outlined"
        onPress={pickImage}
        style={[styles.rowButton, { backgroundColor: COLORS.white }]}
        textColor={COLORS.primary}
      >
        {t("change_profile", language)}
      </Button>

      <Button
        mode="contained"
        onPress={() => onSave(formData)}
        style={[styles.rowButton, { backgroundColor: COLORS.primary }]}
        loading={updating}
        textColor={COLORS.white}
      >
        {t("save_changes", language)}
      </Button>
      {/* </View> */}
    </View>
  );
}

//==================== Info Row ====================
function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={COLORS.grey600}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  );
}

//==================== Styles ====================
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginBottom: 0,
  },
  profileHeader: { marginTop: 30, alignItems: "center", marginBottom: 10 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    marginBottom: 10,
  },
  profileName: { fontSize: 26, fontWeight: "800", color: "#343a40" },
  profileEmail: { color: COLORS.grey600, fontSize: 14, marginBottom: 10 },
  editButtonLabel: { fontSize: 14, fontWeight: "700" },
  tabHeader: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey300,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 16, fontWeight: "600", color: COLORS.textDark },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  infoCard: {
    borderRadius: 16,
    // marginBottom: 80,
    backgroundColor: COLORS.cardBackground,
    elevation: 5,
    height: "auto",
    padding: 10,
  },
  infoCardEdit: {
    borderRadius: 16,

    backgroundColor: COLORS.white,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: { fontSize: 15, color: COLORS.grey600, fontWeight: "600" },
  infoValue: { fontSize: 15, fontWeight: "700", color: "#212529" },
  logoutButtonContained: {
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 3,
    marginTop: 10,
    backgroundColor: COLORS.error,
  },
  inputField: { marginBottom: 10, backgroundColor: "transparent" },
  securityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  securityLabel: { fontSize: 16, color: COLORS.textDark },
  row: { flexDirection: "row", justifyContent: "space-between" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 0,
  },
  rowButton: { flex: 1, marginTop: 5, borderRadius: 12 },
});
