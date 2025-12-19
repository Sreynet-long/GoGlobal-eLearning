import { useMutation, useQuery } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Paragraph,
  RadioButton,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_USER_BY_ID, MOBILE_UPDATE_USER } from "../../schema/login";

const COMPANY_LOGO = require("../../assets/images/Go_Global_IT_logo.png");
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

export default function AccountOrAbout() {
  const theme = useTheme();
  const { language } = useLanguage();
  const { isAuth, loading, user: authUser, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [localProfileImage, setLocalProfileImage] = useState(null);

  // Load cached profile image
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
  } = useQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
  });

  const [updateUser, { loading: updating }] = useMutation(MOBILE_UPDATE_USER, {
    onCompleted: (data) => {
      refetch?.();
      setEditing(false);
      if (data?.mobileUpdateUser?.data) setUser(data.mobileUpdateUser.data);
    },
    onError: (err) => console.error(err),
  });

  const user = userData?.getUserById || authUser || {};

  if (loading || userLoading) return null;

  const handleCall = () => Linking.openURL("tel:012660981");
  const handleEmail = () => Linking.openURL("mailto:goglobalit2022@gmail.com");

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

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Topbar />
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {isAuth ? (
              <AccountView
                user={user}
                editing={editing}
                setEditing={setEditing}
                handleSave={handleSave}
                updating={updating}
                logout={logout}
                language={language}
                localProfileImage={localProfileImage}
                pickImage={pickImage}
              />
            ) : (
              <AboutView
                theme={theme}
                handleCall={handleCall}
                handleEmail={handleEmail}
                language={language}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

//==================== Account View ====================
function AccountView({
  user,
  editing,
  setEditing,
  handleSave,
  updating,
  logout,
  language,
  localProfileImage,
  pickImage,
}) {
  return (
    <View>
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

      <Card style={styles.infoCard}>
        <Card.Title
          title={t("account_information", language)}
          titleStyle={styles.cardTitle}
        />
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
      </Card>

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
    <View>
      <TextInput
        label={t("first_name", language)}
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
        mode="flat"
        style={styles.inputField}
        autoFocus
      />
      <TextInput
        label={t("last_name", language)}
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
        mode="flat"
        style={styles.inputField}
      />
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
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
          <RadioButton.Item label={t("male", language)} value="male" />
          <RadioButton.Item label={t("female", language)} value="female" />
        </View>
      </RadioButton.Group>
      <Button
        mode="outlined"
        onPress={pickImage}
        style={[
          styles.logoutButtonContained,
          { marginBottom: 0 },
          { backgroundColor: COLORS.grey300 },
        ]}
        textColor={COLORS.primary}
      >
        {t("change_profile_image", language) || "Change Profile Image"}
      </Button>

      <Button
        mode="contained"
        onPress={() => onSave(formData)}
        style={[
          styles.logoutButtonContained,
          { backgroundColor: COLORS.primary },
        ]}
        loading={updating}
        textColor={COLORS.white}
      >
        {t("save_changes", language)}
      </Button>
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

//==================== About View ====================
function AboutView({ theme, handleCall, handleEmail, language }) {
  const [openItem, setOpenItem] = useState(null);
  const toggleItem = (key) => setOpenItem(openItem === key ? null : key);

  const contactItems = [
    {
      key: "phone",
      label: t("call_us", language),
      value: "012 660 981",
      icon: "phone",
      onPress: handleCall,
    },
    {
      key: "email",
      label: t("email", language),
      value: "goglobalit2022@gmail.com",
      icon: "email",
      onPress: handleEmail,
    },
    {
      key: "website",
      label: t("website", language),
      value: "https://www.go-globalit.com/",
      icon: "link",
      onPress: () => Linking.openURL("https://www.go-globalit.com/"),
    },
    {
      key: "facebook",
      label: t("facebook", language),
      value:
        "https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d",
      icon: "facebook",
      onPress: () =>
        Linking.openURL(
          "https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d"
        ),
    },
  ];

  return (
    <ScrollView
      style={[
        styles.screenContainer,
        { backgroundColor: theme.colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={COMPANY_LOGO}
            style={[styles.logoImage, { borderColor: theme.colors.primary }]}
            resizeMode="contain"
          />
          <Title style={styles.mainTitle}>
            {t("about_go_elearning", language)}
          </Title>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t("our_story", language)}</Title>
            <Paragraph style={styles.paragraph}>
              {t("our_story_text1", language)}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              {t("our_story_text2", language)}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={[styles.missionVisionItem, { paddingBottom: 0 }]}>
              <Title
                style={[styles.cardTitle, { color: theme.colors.primary }]}
              >
                {t("our_vision", language)}
              </Title>
              <Text style={styles.missionVisionText}>
                {t("our_vision_text", language)}
              </Text>
            </View>
            <View style={styles.missionVisionItem}>
              <Title
                style={[styles.cardTitle, { color: theme.colors.secondary }]}
              >
                {t("our_mission", language)}
              </Title>
              <Text style={styles.missionVisionText}>
                {t("our_mission_text", language)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.contactCard]}>
          <Card.Content>
            <Title style={styles.cardTitle}>{t("contact_us", language)}</Title>
            <View style={styles.contactIconRow}>
              {contactItems.map((item) => (
                <View
                  key={item.key}
                  style={styles.contactIconButton}
                  onClick={() => toggleItem(item.key)}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.contactLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            {openItem && (
              <View style={styles.contactValueContainer}>
                <Text
                  style={styles.contactValue}
                  onPress={contactItems.find((i) => i.key === openItem).onPress}
                >
                  {contactItems.find((i) => i.key === openItem).value}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

//==================== Styles ====================
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  scrollContent: { paddingBottom: 40 },
  card: { marginBottom: 20, borderRadius: 12, elevation: 2 },
  profileHeader: { marginTop: 50, alignItems: "center", marginBottom: 0 },
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
  infoCard: {
    borderRadius: 16,
    marginBottom: 25,
    backgroundColor: COLORS.cardBackground,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    paddingTop: 20,
    textAlign: "center",
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
  mainTitle: { fontSize: 28, fontWeight: "700", marginTop: "20" },
  paragraph: { lineHeight: 22, marginBottom: 10, fontSize: 15 },
  missionVisionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  missionVisionText: { fontSize: 16, fontStyle: "italic", paddingLeft: 10 },
  contactCard: { paddingVertical: 10 },
  contactIconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  contactIconButton: { alignItems: "center", width: 70 },
  contactValueContainer: { marginTop: 10, alignItems: "center" },
  contactLabel: { fontSize: 12, textAlign: "center", marginTop: 4 },
  contactValue: {
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: "none",
    textAlign: "center",
    borderTopWidth: 2,
    padding: 20,
    fontWeight: "bold",
  },
  inputField: { marginBottom: 10, backgroundColor: "transparent" },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
  },
});
