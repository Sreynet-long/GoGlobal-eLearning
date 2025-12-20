import { gql, useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

const VERIFY_OTP = gql`
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

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#D32F2F",
  grey300: "#E0E0E0",
  grey600: "#757575",
  background: "#F7F9FC",
};

export default function VerifyOTP() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { language } = useLanguage();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef([]);

  const [verifyOtp, { loading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data?.verifyOTP?.status && data?.verifyOTP?.data?.token) {
        router.push({
          pathname: "/auth/update-password",
          params: { token: data.verifyOTP.data.token },
        });
      } else {
        showError(
          language === "kh"
            ? data?.verifyOTP?.message?.messageKh
            : data?.verifyOTP?.message?.messageEn ||
                t("incorrect_code", language)
        );
      }
    },
    onError: (err) => showError(err.message),
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      showError(t("enter_all_digits", language));
      return;
    }
    verifyOtp({ variables: { otp: otpCode, token } });
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
            <MaterialIcons
              name="verified-user"
              size={45}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.headerTitle}>
            {t("code_verification", language)}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("type_verification_code", language)}
          </Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollPadding}>
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

          <Button
            mode="contained"
            loading={loading}
            onPress={handleVerify}
            style={styles.verifyButton}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            {t("verify", language)}
          </Button>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {t("didnt_receive_code", language)}
            </Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>
                {t("resend_code", language)}
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 30,
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
    marginTop: 8,
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
    paddingTop: 40,
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
  otpGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderWidth: 1.5,
    borderColor: COLORS.grey300,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "#F8F9FA",
    color: COLORS.primary,
  },
  otpInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    elevation: 4,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },
  resendText: {
    color: COLORS.grey600,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },
});
