import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
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

/* ===================== GRAPHQL ===================== */

const LOGIN_MUTATION = gql`
  mutation MobileLogin($email: String, $password: String) {
    mobileLogin(email: $email, password: $password) {
      status
      message {
        messageEn
      }
      data {
        token
        user {
          first_name
          last_name
          email
          phone_number
        }
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation MobileRegisterAccount($input: MobileRegisterAccountInput) {
    mobileRegisterAccount(input: $input) {
      status
      message {
        messageEn
      }
      data {
        token
        user {
          first_name
          last_name
          email
          phone_number
        }
      }
    }
  }
`;

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
};

/* ===================== COMPONENT ===================== */

export default function AccountScreen() {
  const { isAuth, loading, login, logout, user } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      if (data?.mobileLogin?.status) {
        await login(data.mobileLogin.data.token, data.mobileLogin.data.user);
      } else {
        setError(data?.mobileLogin?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    onCompleted: async (data) => {
      if (data?.mobileRegisterAccount?.status) {
        await login(
          data.mobileRegisterAccount.data.token,
          data.mobileRegisterAccount.data.user
        );
      } else {
        setError(data?.mobileRegisterAccount?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

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
            gender: gender.toUpperCase(),
          },
        },
      });
    } else {
      loginMutation({ variables: { email, password } });
    }
  };

  if (loading) return null;

  /* ===================== SCREEN LAYOUT ===================== */

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

  /* ===================== AUTH ===================== */

  function renderAuth() {
    return (
      <Card style={styles.authCard}>
        <Card.Content>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Welcome Back"}
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
    return (
      <>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Title title="Account Information" />
          <Card.Content>
            <Info label="First Name" value={user?.first_name} />
            <Info label="Last Name" value={user?.last_name} />
            <Info label="Phone" value={user?.phone_number} />
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logout}
          textColor={COLORS.error}
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
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
  },
  profileEmail: {
    color: COLORS.grey600,
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoLabel: {
    color: COLORS.grey600,
  },
  infoValue: {
    fontWeight: "600",
  },
  logout: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
});
