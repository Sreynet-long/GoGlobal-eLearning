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
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { UPDATE_NEW_PASSWORD } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#D32F2F",
  grey600: "#757575",
  background: "#F7F9FC",
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
      <View style={styles.headerBlock}>
        <View style={styles.headerContent}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="security" size={45} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>{t("new_password", language)}</Text>
          <Text style={styles.headerSubtitle}>
            {t("set_new_password", language)}
          </Text>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollPadding}
          keyboardShouldPersistTaps="handled"
        >
          {error ? (
            <View style={styles.errorBox}>
              <MaterialIcons
                name="error-outline"
                size={20}
                color={COLORS.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("new_password", language)}
            mode="outlined"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
            style={styles.inputSpacing}
            outlineColor={COLORS.grey600}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="lock-outline" color={COLORS.primary} />}
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
            style={styles.inputSpacing}
            outlineColor={COLORS.grey600}
            activeOutlineColor={COLORS.primary}
            left={
              <TextInput.Icon
                icon="check-decagram-outline"
                color={COLORS.primary}
              />
            }
          />

          <Button
            mode="contained"
            loading={loading}
            onPress={handleUpdate}
            style={styles.updateButton}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            {t("update_password", language)}
          </Button>

          <View style={styles.tipBox}>
            <MaterialIcons
              name="info-outline"
              size={16}
              color={COLORS.grey600}
            />
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

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  headerBlock: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  scrollPadding: {
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    gap: 10,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: "600",
    flex: 1,
  },
  inputSpacing: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    elevation: 4,
    marginTop: 10,
    marginBottom: 30,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#F1F3F5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    color: COLORS.grey600,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
