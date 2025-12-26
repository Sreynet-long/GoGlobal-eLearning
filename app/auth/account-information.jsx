import { useMutation, useQuery } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  RadioButton,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { IMAGE_BASE_URL } from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_USER_BY_ID, MOBILE_UPDATE_USER } from "../../schema/login";
// import { uploadFiles } from "../../utils/uploadImage";
import UploadImage from "./GlobalUtils/UploadImage";
import deleteImage from "./GlobalUtils/deleteImage";

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
  const { user: authUser, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fileUpload, setFileUpload] = useState([]);

  // useEffect(async () => {
  //   const getFileUpload = await AsyncStorage.getItem('uploadLocalFiles');
  //   console.log(getFileUpload, "getFileUpload")
  //   if (value !== null) {
  //     // value previously stored
  //     setLocalProfileImage(uri);
  //   }
  //   // AsyncStorage.getItem("uploadLocalFiles").then((uri) => {
  //   //   console.log(uri, "AsyncStorage getItem")
  //   //   if (uri) setLocalProfileImage(uri);
  //   // });
  // }, []);
  // console.log(fileUpload,"fileUpload")
  const {
    data: userData,
    refetch,
    loading: userLoading,
  } = useQuery(GET_USER_BY_ID, { fetchPolicy: "network-only" });

  const [updateUser, { loading: updating }] = useMutation(MOBILE_UPDATE_USER, {
    onCompleted: (data) => {
      console.log(data, "data");
      setFileUpload([]);
      refetch?.();
      setEditing(false);
      if (data?.mobileUpdateUser?.data) setUser(data.mobileUpdateUser.data);
    },
  });

  const user = userData?.getUserById || authUser || {};
  if (userLoading) return null;

  console.log(user);
  // console.log(fileUpload, "fileUpload");
  const handleSave = (formData) => {
    updateUser({
      variables: {
        id: user._id,
        input: {
          ...formData,
          profile_image: fileUpload[0]?.filename
            ? fileUpload[0]?.filename
            : user?.profile_image,
        },
      },
    });
  };

  const handleCancel = async ()=>{
    setEditing(!editing)
    await deleteImage(fileUpload[0]?.filename)
    setFileUpload([])
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      // router.replace("/(tabs)/account&Aboutus");
    } else {
      router.replace("/(tabs)/account&Aboutus");
    }
  };
  function getGenderIcon(gender) {
    if (!gender) return "wc";

    const normalized = gender.toLowerCase();

    if (normalized === "male") return "male";
    if (normalized === "female") return "female";

    return "wc";
  }

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
        {/* {editing ? (
           <TouchableOpacity
            onPress={handleCancel}
            style={styles.editBtn}
          >
            <Text
              style={[styles.editBtnText, editing && { color: COLORS.error }]}
            >
              {t("cancel", language)}
            </Text>
          </TouchableOpacity>
         
        ) : (
          <TouchableOpacity
            onPress={() => setEditing(!editing)}
            style={styles.editBtn}
          >
            <Text
              style={[styles.editBtnText, editing && { color: COLORS.error }]}
            >
              { t("edit_profile", language)}
            </Text>
          </TouchableOpacity>
        )} */}
      </View>
      <View style={styles.headerHero}>
        <View style={styles.avatarWrapper}>
          <Surface style={styles.avatarSurface} elevation={editing ? 8 : 2}>
            <Image
              source={{
                uri: fileUpload[0]?.filename
                  ? `${IMAGE_BASE_URL}/file/${fileUpload[0]?.filename}`
                  : user?.profile_image
                  ? `${IMAGE_BASE_URL}/file/${user?.profile_image}`
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
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
            {/* <View> */}
              <Text style={styles.contentTitle}>{t("account_information", language)}</Text>
            {/* </View> */}

            <TouchableOpacity
              onPress={editing ? handleCancel : () => setEditing(true)}
              style={[styles.editActionBtn, editing && styles.cancelActionBtn]}
            >
              <MaterialIcons name={editing ? "close" : "edit"} size={16} color={COLORS.white} />
              <Text style={styles.editActionText}>
                {editing ? t("cancel", language) : t("edit_profile", language)}
              </Text>
            </TouchableOpacity>
          </View>

        {editing ? (
          <EditUser
            initialData={user}
            onSave={handleSave}
            updating={updating}
            language={language}
          />
        ) : (
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
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function EditUser({ initialData, onSave, updating, language }) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    phone_number: initialData.phone_number || "",
    gender: initialData.gender || "Male",
  });

  return (
    <View style={styles.formContainer}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TextInput
          label={t("first_name", language)}
          value={formData.first_name}
          onChangeText={(v) => setFormData({ ...formData, first_name: v })}
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
          contentStyle={styles.inputContent}
          outlineColor={COLORS.grey200}
          activeOutlineColor={COLORS.primary}
        />

        <TextInput
          label={t("last_name", language)}
          value={formData.last_name}
          onChangeText={(v) => setFormData({ ...formData, last_name: v })}
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
          contentStyle={styles.inputContent}
          outlineColor={COLORS.grey200}
          activeOutlineColor={COLORS.primary}
        />
      </View>
      <TextInput
        label={t("phone", language)}
        value={formData.phone_number}
        onChangeText={(v) => setFormData({ ...formData, phone_number: v })}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
        contentStyle={styles.inputContent}
        outlineColor={COLORS.grey200}
        activeOutlineColor={COLORS.primary}
      />

      <View style={styles.genderBox}>
        <Text style={styles.genderLabel}>{t("gender", language)}</Text>

        <View style={styles.radioGroup}>
          {["male", "female"].map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setFormData({ ...formData, gender: g })}
              style={[
                styles.genderOption,
                formData.gender === g && styles.genderOptionActive,
              ]}
            >
              <RadioButton.Android
                value={g}
                status={formData.gender === g ? "checked" : "unchecked"}
                color={COLORS.primary}
              />
              <Text
                style={[
                  styles.genderText,
                  formData.gender === g && styles.genderTextActive,
                ]}
              >
                {t(g, language)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        mode="contained"
        onPress={() => onSave(formData)}
        loading={updating}
        style={styles.saveBtn}
      >
        {t("save_changes", language)}
      </Button>
    </View>
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
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  editBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 17 },

  headerHero: {
    paddingTop: Platform.OS === "ios" ? 0 : 0,
    paddingBottom: 30,
    alignItems: "center",
  },
  avatarWrapper: { marginBottom: 5 },
  avatarSurface: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 4,
    backgroundColor: COLORS.white,
    position: "relative",
    borderWidth: 5,
    borderColor: COLORS.accent,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 55 },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  heroName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  userEmailText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  contentTitle: {
    fontSize: 37,
    fontWeight: "900",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // goldBar: {
  //   width: 25,
  //   height: 3,
  //   backgroundColor: COLORS.accent,
  //   marginTop: 4,
  //   borderRadius: 2,
  // },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    paddingTop: 20,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderTopWidth: 5,
    borderColor: COLORS.accent,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },

  infoGrid: { gap: 12 },
  tile: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grey200,
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

  formContainer: { gap: 9 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  inputContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  genderBox: { marginTop: 0 },
  genderLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.grey600,
    marginBottom: 12,
  },
  radioGroup: { flexDirection: "row", gap: 12 },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
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
