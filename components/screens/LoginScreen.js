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

const COMPANY_LOGO = require("../../assets/images/Go_Global_IT_logo.png");

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  error: "#D32F2F",
  grey600: "#757575",
  background: "#F7F9FC",
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
        const msg =
          data?.mobileLogin?.message?.[`message${language.toUpperCase()}`] ||
          t("invalid_email_password", language);
        setError(msg);
      }
    },
    onError: (err) => {
      setError(err.message || t("invalid_email_password", language));
    },
  });

  const [signupMutation] = useMutation(MOBILE_REGISTER_ACCOUNT, {
    onCompleted: async (data) => {
      if (data?.mobileRegisterAccount?.status) {
        await login(data.mobileRegisterAccount.data.token);
        await fetchUser();
        resetForm();
      } else
        setError(
          data?.mobileRegisterAccount?.message?.[
            `message${language.toUpperCase()}`
          ]
        );
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
    } else loginMutation({ variables: { email, password } });
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
        <View style={styles.headerInfo}>
          {/* <View style={styles.logoCircle}>
            <Image
              source={COMPANY_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />
          </View> */}
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
      </View>
      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isSignUp && (
            <View style={styles.formSection}>
              <View style={styles.row}>
                <TextInput
                  label={t("first_name", language)}
                  mode="outlined"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.flexInput}
                  outlineColor={COLORS.grey600}
                  activeOutlineColor={COLORS.primary}
                />
                <TextInput
                  label={t("last_name", language)}
                  mode="outlined"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.flexInput}
                  outlineColor={COLORS.grey600}
                  activeOutlineColor={COLORS.primary}
                />
              </View>

              <TextInput
                label={t("phone", language)}
                mode="outlined"
                value={phone}
                onChangeText={setPhone}
                style={styles.inputSpacing}
                keyboardType="phone-pad"
                outlineColor={COLORS.grey600}
                activeOutlineColor={COLORS.primary}
              />

              <View style={styles.radioContainer}>
                <Text style={styles.radioLabel}>{t("gender", language)}</Text>
                <RadioButton.Group value={gender} onValueChange={setGender}>
                  <View style={styles.radioRow}>
                    {["MALE", "FEMALE", "OTHER"].map((g) => (
                      <View key={g} style={styles.radioItem}>
                        <RadioButton value={g} color={COLORS.primary} />
                        <Text style={styles.radioText}>
                          {t(g.toLowerCase(), language)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          )}

          <TextInput
            label={t("email", language)}
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.inputSpacing}
            autoCapitalize="none"
            outlineColor={COLORS.grey600}
            activeOutlineColor={COLORS.primary}
          />
          <TextInput
            label={t("password", language)}
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.inputSpacing}
            outlineColor={COLORS.grey600}
            activeOutlineColor={COLORS.primary}
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
            contentStyle={{ paddingVertical: 6 }}
          >
            {isSignUp ? t("sign_up", language) : t("log_in", language)}
          </Button>

          <View style={styles.footerActions}>
            {!isSignUp && (
              <Button
                onPress={() => router.push("/auth/forgot-password")}
                textColor={COLORS.primary}
                labelStyle={{ fontWeight: "700" }}
              >
                {t("forgot_password", language)}
              </Button>
            )}

            <TouchableOpacity
              onPress={toggleForm}
              style={styles.toggleTextContainer}
            >
              <Text style={styles.greyText}>
                {isSignUp
                  ? t("already_have_account", language)
                  : t("dont_have_account", language)}
                <Text style={styles.accentText}>
                  {isSignUp ? t("log_in", language) : t("sign_up", language)}
                </Text>
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
    paddingBottom: 60,
  },
  headerInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
  },
  logo: { width: 50, height: 50 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: COLORS.white },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 4,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
  },
  scrollPadding: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 40,
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: { color: COLORS.error, fontWeight: "600" },

  formSection: { marginBottom: 10 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  flexInput: { flex: 1, backgroundColor: COLORS.white },
  inputSpacing: { marginBottom: 5, backgroundColor: COLORS.white },

  radioContainer: {
    marginBottom: 15,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
  },
  radioLabel: {
    fontSize: 13,
    color: COLORS.grey600,
    marginBottom: 5,
    fontWeight: "600",
  },
  radioRow: { flexDirection: "row", justifyContent: "space-around" },
  radioItem: { flexDirection: "row", alignItems: "center" },
  radioText: { fontSize: 14, color: COLORS.primary },

  checkboxArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: -8,
  },
  checkboxText: { fontSize: 14, color: COLORS.grey600 },

  mainButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    marginTop: 10,
    elevation: 2,
  },
  footerActions: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleTextContainer: {
    marginTop: 0,
    padding: 10,
  },
  greyText: { color: COLORS.grey600, fontSize: 14 },
  accentText: { color: COLORS.primary, fontWeight: "800" },
});
