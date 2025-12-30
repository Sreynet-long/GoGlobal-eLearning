import { useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { FORGOT_PASSWORD } from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#E11D48",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  bgLight: "#F8FAFC",
};

export default function ForgotPassword() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      if (data?.forgotPassword?.status) {
        router.push({
          pathname: "/auth/verify-otp",
          params: { token: data.forgotPassword.data.token },
        });
      } else {
        setError(
          language === "kh"
            ? data?.forgotPassword?.message?.messageKh
            : data?.forgotPassword?.message?.messageEn
        );
      }
    },
    onError: (err) => setError(err.message),
  });

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <View style={styles.iconSoftSquare}>
            <MaterialIcons name="lock-reset" size={42} color={COLORS.primary} />
          </View>
        </View>
        <Text style={styles.heroTitle}>{t("forgot_password", language)}</Text>
        <Text style={styles.heroSubtitle}>
          {t("enter_email_for_reset", language)}
        </Text>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons
                name="error-outline"
                size={18}
                color={COLORS.error}
              />
              <RNText style={styles.errorText}>{error}</RNText>
            </View>
          ) : null}

          <View style={styles.formArea}>
            <TextInput
              label={t("email", language)}
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor={COLORS.primary}
              left={
                <TextInput.Icon icon="email-outline" color={COLORS.grey600} />
              }
            />

            <Button
              mode="contained"
              loading={loading}
              onPress={() => forgotPassword({ variables: { email } })}
              style={styles.sendButton}
              contentStyle={styles.sendButtonContent}
              labelStyle={styles.sendButtonLabel}
            >
              <RNText>{t("send_code", language)}</RNText>
            </Button>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="keyboard-backspace"
              size={20}
              color={COLORS.grey600}
            />
            <RNText style={styles.backButtonText}>
              {t("back_to_login", language)}
            </RNText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  errorText: {
    color: COLORS.error,
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },

  formArea: { width: "100%" },
  input: { backgroundColor: COLORS.white, marginBottom: 25 },
  inputOutline: { borderRadius: 12, borderColor: COLORS.grey200 },

  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    elevation: 0,
  },
  sendButtonContent: { height: 56 },
  sendButtonLabel: { fontSize: 16, fontWeight: "800" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 10,
  },
  backButtonText: {
    color: COLORS.grey600,
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
  },
});
