import { useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { MOBILE_UPDATE_NEW_PASSWORD } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#E11D48",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  bgLight: "#F8FAFC",
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { language } = useLanguage();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [mobileUpdatePassword, { loading }] = useMutation(
    MOBILE_UPDATE_NEW_PASSWORD,
    {
      onCompleted: ({ mobileUpdatePassword }) => {
        const status = mobileUpdatePassword?.status;
        const backendMessage =
          mobileUpdatePassword?.message?.[
            language === "kh" ? "messageKh" : "messageEn"
          ];

        Alert.alert(
          status
            ? t("success", language) || "Success"
            : t("error", language) || "Error",
          backendMessage ||
            (status
              ? t("update_password_success", language) ||
                "Password updated successfully"
              : t("old_password_incorrect", language) ||
                "Old password is incorrect")
        );

        if (status) {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          router.push("/(tabs)/account&Aboutus");
        }
      },
    }
  );

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert(
        t("error", language) || "Error",
        t("fill_all_fields", language) || "Please fill all fields"
      );
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert(
        t("error", language) || "Error",
        t("passwords_do_not_match", language) || "Passwords do not match"
      );
    }
    mobileUpdatePassword({
      variables: { oldPassword, newPassword },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/account&Aboutus");
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.topBackBtn} onPress={handleBack}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.iconSoftSquare}>
              <MaterialIcons
                name="lock-person"
                size={40}
                color={COLORS.accent}
              />
            </View>
          </View>
          <Text style={styles.heroTitle}>
            {t("change_password", language) || "Change Password"}
          </Text>
          <Text style={styles.heroSubtitle}>
            {t(
              "Update_your_credentials_to_keep_your_account_secure",
              language
            ) || "Update your credentials to keep your account secure"}
          </Text>
        </View>

        <View style={styles.accentBackgroundLayer}>
          <Surface style={styles.mainContentArea} elevation={0}>
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { flexGrow: 1, minHeight: "100%" },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formArea}>
                <TextInput
                  label={t("old_password", language) || "Old Password"}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  mode="outlined"
                  secureTextEntry={!showPass}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                  left={
                    <TextInput.Icon icon="lock-clock" color={COLORS.grey600} />
                  }
                  right={
                    <TextInput.Icon
                      icon={showPass ? "eye-off" : "eye"}
                      onPress={() => setShowPass(!showPass)}
                      color={COLORS.grey600}
                    />
                  }
                />

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <RNText style={styles.dividerText}>
                    {t("NEW_CREDENTIALS", language) || "NEW CREDENTIALS"}
                  </RNText>
                  <View style={styles.dividerLine} />
                </View>

                <TextInput
                  label={t("new_password", language) || "New Password"}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  mode="outlined"
                  secureTextEntry={!showPass}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                  left={
                    <TextInput.Icon icon="lock-reset" color={COLORS.grey600} />
                  }
                />

                <TextInput
                  label={t("confirm_password", language) || "Confirm Password"}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={!showPass}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                  left={
                    <TextInput.Icon
                      icon="check-decagram-outline"
                      color={COLORS.grey600}
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.updateButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  <RNText>
                    {t("update_password", language) || "Update Password"}
                  </RNText>
                </Button>
              </View>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  heroSection: {
    paddingTop: Platform.OS === "ios" ? 30 : 25,
    paddingBottom: 40,
    alignItems: "center",
  },
  topBackBtn: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 25 : 15,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: { marginBottom: 15 },
  iconSoftSquare: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
    borderWidth: 4,
    borderColor: COLORS.accent,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 50,
    lineHeight: 18,
  },
  accentBackgroundLayer: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 6,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  formArea: { width: "100%" },
  input: { backgroundColor: COLORS.white, marginBottom: 16 },
  inputOutline: { borderRadius: 14, borderColor: COLORS.grey200 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.grey200 },
  dividerText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.grey600,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginHorizontal: 10,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginTop: 15,
  },
  buttonContent: { height: 56 },
  buttonLabel: { fontSize: 16, fontWeight: "700" },
});
