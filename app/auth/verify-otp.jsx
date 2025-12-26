// pages/auth/verify-otp.jsx
import { gql, useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#E11D48",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  bgLight: "#F8FAFC",
};

// ==================== OTP Mutation ====================
export const VERIFY_OTP = gql`
  mutation VerifyOTP($otp: String!, $token: String!) {
    verifyOTP(otp: $otp, token: $token) {
      status
      message {
        messageKh
        messageEn
      }
      data {
        token
      }
    }
  }
`;

export default function VerifyOTP() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { language } = useLanguage();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef([]);

  const [verifyOtp, { loading }] = useMutation(VERIFY_OTP, {
    onCompleted: async (data) => {
      if (data?.verifyOTP?.status && data?.verifyOTP?.data?.token) {
        await AsyncStorage.multiRemove(["otpToken", "otpPhone", "pendingOtp"]);
        router.replace({
          pathname: "/auth/update-password",
          params: { token: data.verifyOTP.data.token },
        });
      } else {
        setError(
          language === "kh"
            ? data?.verifyOTP?.message?.messageKh
            : data?.verifyOTP?.message?.messageEn || t("incorrect_code", language)
        );
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <View style={styles.iconPulse}>
            <MaterialIcons name="security" size={40} color={COLORS.primary} />
          </View>
        </View>
        <Text style={styles.heroTitle}>{t("code_verification", language)}</Text>
        <Text style={styles.heroSubtitle}>
          {t("type_verification_code", language)}
        </Text>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.otpWrapper}>
            <View style={styles.otpGrid}>
              {otp.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpInput,
                    focusedIndex === index && styles.otpInputFocused,
                    digit !== "" && styles.otpInputFilled,
                  ]}
                  selectionColor={COLORS.primary}
                />
              ))}
            </View>
          </View>

          <Button
            mode="contained"
            loading={loading}
            onPress={() => verifyOtp({ variables: { otp: otp.join(""), token } })}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            {t("verify", language)}
          </Button>

          <View style={styles.footerCenter}>
            <View style={styles.resendRow}>
              <Text style={styles.resendPrompt}>{t("didnt_receive_code", language)}</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.resendAction}>{t("resend_code", language)}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
              <MaterialIcons name="keyboard-backspace" size={20} color={COLORS.grey600} />
              <Text style={styles.backLinkText}>{t("back_to_forgot_password", language)}</Text>
            </TouchableOpacity>
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
  iconPulse: {
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
  heroTitle: { fontSize: 26, fontWeight: "900", color: COLORS.white, textAlign: "center", letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 15, color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8, lineHeight: 22 },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
  },
  scrollContent: { paddingHorizontal: 30, paddingTop: 40, paddingBottom: 40, alignItems: "center" },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    gap: 10,
  },
  errorText: { color: COLORS.error, fontWeight: "600", fontSize: 13 },

  otpWrapper: { width: "100%", alignItems: "center", marginBottom: 40 },
  otpGrid: { flexDirection: "row", justifyContent: "center", gap: 10 },
  otpInput: { width: 46, height: 58, borderWidth: 1.5, borderColor: COLORS.grey200, borderRadius: 14, fontSize: 22, fontWeight: "800", textAlign: "center", backgroundColor: COLORS.bgLight, color: COLORS.primary },
  otpInputFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.white, borderWidth: 2 },
  otpInputFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.white },

  actionButton: { width: "100%", borderRadius: 16, backgroundColor: COLORS.primary, marginBottom: 30 },
  actionButtonContent: { height: 56 },
  actionButtonLabel: { fontSize: 16, fontWeight: "800" },

  footerCenter: { alignItems: "center", width: "100%" },
  resendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 25 },
  resendPrompt: { color: COLORS.grey600, fontSize: 14 },
  resendAction: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },
  backLink: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10 },
  backLinkText: { color: COLORS.grey600, fontWeight: "700", fontSize: 14 },
});
