import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import {
  Button,
  Checkbox,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import {
  GET_USER_BY_ID,
  MOBILE_LOGIN,
  MOBILE_REGISTER_ACCOUNT,
} from "../../schema/login";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#D32F2F",
  grey200: "#E2E8F0",
  grey600: "#64748B",
  background: "#F8FAFC",
};

export default function LoginScreen() {
  const { language } = useLanguage();
  const { login, setUser, isAuth, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [fetchUser] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getUserById) setUser(data.getUserById);
    },
  });

  const [loginMutation] = useMutation(MOBILE_LOGIN, {
    onCompleted: async (data) => {
      if (data?.mobileLogin?.status) {
        await login(data.mobileLogin.data.token);
        await fetchUser();
        resetForm();
      } else {
        setError(
          data?.mobileLogin?.message?.[`message${language.toUpperCase()}`] ||
            t("invalid_email_password", language)
        );
      }
    },
    onError: (err) =>
      setError(err.message || t("invalid_email_password", language)),
  });

  const [signupMutation] = useMutation(MOBILE_REGISTER_ACCOUNT, {
    onCompleted: async (data) => {
      if (data?.mobileRegisterAccount?.status) {
        await login(data.mobileRegisterAccount.data.token);
        await fetchUser();
        resetForm();
      } else {
        setError(
          data?.mobileRegisterAccount?.message?.[
            `message${language.toUpperCase()}`
          ]
        );
      }
    },
    onError: (err) => setError(err.message),
  });

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setGender("");
    setEmail("");
    setPassword("");
    setAgreeTerms(false);
    setError("");
  };

  const handleAuth = () => {
    setError("");
    if (!email || !password)
      return setError(t("email_password_required", language));
    if (isSignUp) {
      if (!firstName || !lastName || !phone || !gender)
        return setError(t("complete_all_fields", language));
      if (!agreeTerms) return setError(t("agree_terms_required", language));
      signupMutation({
        variables: {
          input: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            email,
            password,
            gender: gender.toLowerCase(),
          },
        },
      });
    } else {
      loginMutation({ variables: { email, password } });
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (loading || isAuth) return null;

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.headerBlock}>
        <Topbar />
      </View>

      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {isSignUp
                ? t("create_account", language)
                : t("welcome_back", language)}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isSignUp
                ? t("join_us_today", language)
                : t("please_login_to_continue", language)}
            </Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            {isSignUp && (
              <>
                <View style={styles.row}>
                  <TextInput
                    label={t("first_name", language)}
                    mode="outlined"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.flexInput}
                    outlineStyle={styles.inputOutline}
                  />
                  <TextInput
                    label={t("last_name", language)}
                    mode="outlined"
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.flexInput}
                    outlineStyle={styles.inputOutline}
                  />
                </View>

                <TextInput
                  label={t("phone", language)}
                  mode="outlined"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.inputSpacing}
                  keyboardType="phone-pad"
                  outlineStyle={styles.inputOutline}
                />

                <View style={styles.genderContainer}>
                  <Text style={styles.genderLabel}>
                    {t("gender", language)}
                  </Text>
                  <RadioButton.Group value={gender} onValueChange={setGender}>
                    <View style={styles.radioRow}>
                      {["MALE", "FEMALE", "OTHER"].map((g) => (
                        <TouchableOpacity
                          onPress={() => setGender(g)}
                          style={styles.radioItem}
                        >
                          <RadioButton value={g} color={COLORS.primary} />
                          <Text style={styles.radioText}>
                            {t(g.toLowerCase(), language)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}

            <TextInput
              label={t("email", language)}
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.inputSpacing}
              autoCapitalize="none"
              outlineStyle={styles.inputOutline}
              left={
                <TextInput.Icon icon="email-outline" color={COLORS.grey600} />
              }
            />

            <TextInput
              label={t("password", language)}
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.inputSpacing}
              outlineStyle={styles.inputOutline}
              left={
                <TextInput.Icon icon="lock-outline" color={COLORS.grey600} />
              }
            />

            {isSignUp && (
              <TouchableOpacity
                style={styles.checkboxArea}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <Checkbox
                  status={agreeTerms ? "checked" : "unchecked"}
                  color={COLORS.primary}
                />
                <Text style={styles.checkboxText}>
                  {t("agree_terms", language)}
                </Text>
              </TouchableOpacity>
            )}

            <Button
              mode="contained"
              onPress={handleAuth}
              style={styles.mainButton}
              contentStyle={styles.buttonContent}
            >
              {isSignUp ? t("sign_up", language) : t("log_in", language)}
            </Button>
          </View>

          <View style={styles.footerActions}>
            {!isSignUp && (
              <Button
                onPress={() => router.push("/auth/forgot-password")}
                textColor={COLORS.primary}
                labelStyle={styles.forgotBtnLabel}
              >
                {t("forgot_password", language)}
              </Button>
            )}

            <TouchableOpacity
              onPress={toggleForm}
              style={styles.toggleTextContainer}
            >
              <Text style={styles.greyText}>
                {String(
                  isSignUp
                    ? t("already_have_account", language)
                    : t("dont_have_account", language)
                )}{" "}
                <Text style={styles.accentText}>
                  {String(
                    isSignUp ? t("log_in", language) : t("sign_up", language)
                  )}
                </Text>
              </Text>
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
  headerBlock: { paddingBottom: 10 },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 0,
    paddingBottom: 90,
    flexGrow: 1,
    justifyContent: "center",
  },

  headerInfo: {
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.grey600,
    marginTop: 0,
    textAlign: "center",
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    alignItems: "center",
  },
  errorText: { color: COLORS.error, fontWeight: "600", textAlign: "center" },

  formContainer: {
    width: "100%",
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 0 },
  flexInput: { flex: 1, backgroundColor: COLORS.white },
  inputSpacing: { marginBottom: 8, backgroundColor: COLORS.white },
  inputOutline: { borderRadius: 12, borderColor: COLORS.grey200 },

  genderContainer: {
    marginBottom: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  genderLabel: {
    fontSize: 14,
    color: COLORS.grey600,
    marginBottom: 5,
    fontWeight: "700",
  },
  radioRow: { flexDirection: "row", justifyContent: "space-between" },
  radioItem: { flexDirection: "row", alignItems: "center" },
  radioText: { fontSize: 14, color: COLORS.primary, fontWeight: "500" },

  checkboxArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxText: { fontSize: 14, color: COLORS.grey600, fontWeight: "500" },

  mainButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    elevation: 0,
    shadowColor: "transparent",
  },
  buttonContent: {
    height: 54,
  },

  footerActions: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotBtnLabel: { fontWeight: "700", fontSize: 14 },
  toggleTextContainer: {
    marginTop: 0,
    padding: 0,
  },
  greyText: { color: COLORS.grey600, fontSize: 15, textAlign: "center" },
  accentText: { color: COLORS.primary, fontWeight: "800" },
});
