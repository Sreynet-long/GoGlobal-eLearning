import { useMutation } from "@apollo/client";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
  error: "#D32F2F",
  grey600: "#757575",
  background: "#F7F9FC",
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
      <View style={styles.headerBlock}>
        <View style={styles.headerContent}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="lock-reset" size={45} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>
            {t("forgot_password", language)}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("enter_email_for_reset", language)}
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
            label={t("email", language)}
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputSpacing}
            outlineColor={COLORS.grey600}
            activeOutlineColor={COLORS.primary}
            left={
              <TextInput.Icon icon="email-outline" color={COLORS.primary} />
            }
          />

          <Button
            mode="contained"
            loading={loading}
            onPress={() => forgotPassword({ variables: { email } })}
            style={styles.sendButton}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            {t("send_code", language)}
          </Button>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>
              {t("back_to_login", language)}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 25,
    backgroundColor: COLORS.white,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 5,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
