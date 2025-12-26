import { useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { UPDATE_NEW_PASSWORD } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#E11D48",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  bgLight: "#F8FAFC",
};

export default function UpdatePassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { language } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [updatePassword, { loading }] = useMutation(UPDATE_NEW_PASSWORD, {
    onCompleted: (data) => {
      if (data?.updateNewPassword?.status) {
        router.replace("/myCourses&Login");
      } else {
        setError(
          language === "kh"
            ? data?.updateNewPassword?.message?.messageKh
            : data?.updateNewPassword?.message?.messageEn
        );
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleUpdate = () => {
    if (!password || !confirmPassword) {
      setError(t("fill_both_fields", language));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwords_do_not_match", language));
      return;
    }
    setError("");
    updatePassword({ variables: { password, token } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <View style={styles.iconSoftSquare}>
            <MaterialIcons name="verified-user" size={42} color={COLORS.primary} />
          </View>
        </View>
        <Text style={styles.heroTitle}>{t("new_password", language)}</Text>
        <Text style={styles.heroSubtitle}>{t("set_new_password", language)}</Text>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formArea}>
            <TextInput
              label={t("new_password", language)}
              mode="outlined"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor={COLORS.primary}
              left={<TextInput.Icon icon="lock-outline" color={COLORS.grey600} />}
              right={
                <TextInput.Icon
                  icon={showPass ? "eye-off" : "eye"}
                  onPress={() => setShowPass(!showPass)}
                  color={COLORS.grey600}
                />
              }
            />

            <TextInput
              label={t("confirm_password", language)}
              mode="outlined"
              secureTextEntry={!showPass}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor={COLORS.primary}
              left={<TextInput.Icon icon="shield-check-outline" color={COLORS.grey600} />}
            />

            <Button
              mode="contained"
              loading={loading}
              onPress={handleUpdate}
              style={styles.updateButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {t("update_password", language)}
            </Button>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="keyboard-backspace" size={20} color={COLORS.grey600} />
            <Text style={styles.backButtonText}>{t("back_to_forgot_password", language)}</Text>
          </TouchableOpacity>

          <View style={styles.tipBox}>
            <MaterialIcons name="lightbulb-outline" size={18} color={COLORS.accent} />
            <Text style={styles.tipText}>
              Make sure your password is at least 8 characters long for better
              security.
            </Text>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

//==================== Styles ====================

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  
  heroSection: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 60,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: { marginBottom: 20 },
  iconSoftSquare: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 45,
    paddingBottom: 40,
    alignItems: "center",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 25,
    width: "100%",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  errorText: { color: COLORS.error, fontWeight: "600", fontSize: 13, flex: 1 },

  formArea: { width: "100%" },
  input: { backgroundColor: COLORS.white, marginBottom: 16 },
  inputOutline: { borderRadius: 12, borderColor: COLORS.grey200 },

  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginTop: 10,
    elevation: 0,
  },
  buttonContent: { height: 56 },
  buttonLabel: { fontSize: 16, fontWeight: "800" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
    gap: 8,
  },
  backButtonText: { color: COLORS.grey600, fontWeight: "700", fontSize: 14 },

  tipBox: {
    flexDirection: "row",
    backgroundColor: COLORS.bgLight,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
    marginTop: 30,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    width: '100%',
  },
  tipText: {
    color: COLORS.grey600,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500'
  },
});