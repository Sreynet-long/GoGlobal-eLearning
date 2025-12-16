import { useMutation, useQuery } from "@apollo/client/react";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import {
  GET_USER_BY_ID,
  MOBILE_LOGIN,
  MOBILE_REGISTER_ACCOUNT,
} from "../../schema/login";

/* ===================== COLORS ===================== */

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F7F9FC",
  white: "#FFFFFF",
  error: "#D32F2F",
  textDark: "#212121",
  textLight: "#FFFFFF",
  grey300: "#E0E0E0",
  grey600: "#757575",
  cardBackground: "#FFFFFF",
  borderLight: "#e9ecef",
};

/* ===================== COMPONENT ===================== */

export default function AccountScreen() {
  const { isAuth, loading, login, logout, user: authUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  /* ===================== MUTATIONS ===================== */

  const [loginMutation] = useMutation(MOBILE_LOGIN, {
    onCompleted: async (data) => {
      if (data?.mobileLogin?.status) {
        await login(data.mobileLogin.data.token);
      } else {
        setError(data?.mobileLogin?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  const [signupMutation] = useMutation(MOBILE_REGISTER_ACCOUNT, {
    onCompleted: async (data) => {
      if (data?.mobileRegisterAccount?.status) {
        await login(data.mobileRegisterAccount.data.token);
      } else {
        setError(data?.mobileRegisterAccount?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  /* ===================== QUERY ===================== */

  const {
    data: userData,
    refetch: refetchUser,
    loading: userLoading,
  } = useQuery(GET_USER_BY_ID, {
    skip: !isAuth,
  });

  useEffect(() => {
    if (isAuth) {
      refetchUser();
    }
  }, [isAuth]);

  /* ===================== HANDLE AUTH ===================== */

  const handleAuth = async () => {
    setError("");

    if (!email || !password) return setError("Email and password are required");

    if (isSignUp) {
      if (!firstName || !lastName || !phone || !gender)
        return setError("Please complete all fields");
      if (!agreeTerms)
        return setError("You must agree to the terms and conditions");
    }

    if (isSignUp) {
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

  if (loading || userLoading) return null;

  function InfoWithIcon({ label, value, iconName }) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 6,
        }}
      >
        {iconName && (
          <MaterialIcons name={iconName} size={20} style={{ marginRight: 8 }} />
        )}
        <Text style={{ color: "#757575", fontWeight: "600" }}>{label}: </Text>
        <Text style={{ fontWeight: "600" }}>{value}</Text>
      </View>
    );
  }
  /* ===================== RENDER ===================== */

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Topbar />

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {!isAuth ? renderAuth() : renderProfile()}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );

  /* ===================== AUTH FORM ===================== */

  function renderAuth() {
    return (
      <Card style={styles.authCard}>
        <Card.Content>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Log In"}
          </Text>

          {error && <Text style={styles.error}>{error}</Text>}

          {isSignUp && (
            <>
              <View style={styles.row}>
                <TextInput
                  label="First Name"
                  mode="outlined"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.flex}
                />
                <TextInput
                  label="Last Name"
                  mode="outlined"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.flex}
                />
              </View>

              <TextInput
                label="Phone"
                mode="outlined"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />

              <Text style={styles.sectionLabel}>Gender</Text>
              <RadioButton.Group value={gender} onValueChange={setGender}>
                <View style={styles.radioRow}>
                  {["MALE", "FEMALE", "OTHER"].map((g) => (
                    <View key={g} style={styles.radioItem}>
                      <RadioButton value={g} />
                      <Text>{g}</Text>
                    </View>
                  ))}
                </View>
              </RadioButton.Group>

              <View style={styles.checkboxRow}>
                <Checkbox
                  status={agreeTerms ? "checked" : "unchecked"}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                />
                <Text>I agree to the Terms and Conditions</Text>
              </View>

              <Divider style={{ marginVertical: 12 }} />
            </>
          )}

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleAuth}
            style={{ backgroundColor: "#25375A", borderRadius: 8 }}
            contentStyle={{ height: 48, justifyContent: "center" }}
            labelStyle={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>

          <Button onPress={() => setIsSignUp(!isSignUp)}>
            {isSignUp
              ? "Already have an account? Log in"
              : "Need an account? Sign up"}
          </Button>
        </Card.Content>
      </Card>
    );
  }

  /* ===================== PROFILE ===================== */

  function renderProfile() {
    const user = userData?.getUserById || authUser;

    return (
      <>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                user?.profile_image ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Button
            mode="text"
            labelStyle={styles.editButtonLabel}
            textColor={COLORS.primary}
            onPress={() => {}}
          >
            Edit Profile
          </Button>
        </View>

        <Card style={styles.infoCard}>
          <Card.Title
            title="Account Information"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <InfoWithIcon
              label="First Name"
              value={user?.first_name}
              icon="account"
            />
            <InfoWithIcon
              label="Last Name"
              value={user?.last_name}
              icon="account"
            />
            <InfoWithIcon
              label="Phone"
              value={user?.phone_number}
              icon="phone"
            />
            <InfoWithIcon
              label="Gender"
              value={user?.gender}
              icon="gender-male-female"
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButtonContained}
          textColor={COLORS.white}
        >
          Log Out
        </Button>
      </>
    );
  }
}

/* ===================== HELPERS ===================== */

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    marginTop: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 80,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 12,
  },
  authCard: {
    borderRadius: 16,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flex: { flex: 1 },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
    color: "#343a40",
  },
  profileEmail: {
    color: COLORS.grey600,
    fontSize: 14,
    marginBottom: 10,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 25,
    backgroundColor: COLORS.cardBackground,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingHorizontal: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.grey600,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212529",
  },

  logoutButtonContained: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
