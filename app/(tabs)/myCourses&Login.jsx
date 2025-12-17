import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import {
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

import { useRouter } from "expo-router";
import EnrolledCourses from "../../components/courses/EnrolledCourses";
import FeatureCategory from "../../components/courses/FeatureCategory";
import Search from "../../components/courses/Search";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { MOBILE_LOGIN, MOBILE_REGISTER_ACCOUNT } from "../../schema/login";

export default function MyCoursesOrLogin() {
  const { isAuth, loading, login } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // ===================== Auth States =====================
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

  // ===================== Reset Form =====================
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

  // ===================== Mutations =====================
  const [loginMutation] = useMutation(MOBILE_LOGIN, {
    onCompleted: async (data) => {
      if (data?.mobileLogin?.status) {
        await login(data.mobileLogin.data.token);
        resetForm();
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
        resetForm();
      } else {
        setError(data?.mobileRegisterAccount?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  // ===================== Handle Auth =====================
  const handleAuth = () => {
    setError("");

    if (!email || !password) return setError("Email and password are required");

    if (isSignUp) {
      if (!firstName || !lastName || !phone || !gender)
        return setError("Please complete all fields");
      if (!agreeTerms) return setError("You must agree to the terms");
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

  // ===================== Switch Form =====================
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (loading) return null;

  // ===================== Render =====================
  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Topbar />

      <View style={styles.contentContainer}>
        {isAuth ? renderMyCourses() : renderLogin()}
      </View>
    </KeyboardAvoidingView>
  );

  // ===================== MY COURSES =====================
  function renderMyCourses() {
    return (
      <>
        <Search />

        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <FeatureCategory onSelectedCategory={setSelectedCategory} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <EnrolledCourses selectedCategory={selectedCategory} />
        </ScrollView>
      </>
    );
  }

  // ===================== LOGIN / SIGNUP =====================
  function renderLogin() {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  style={styles.input}
                />

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
                  <Text>I agree to the terms & Conditions </Text>
                </View>

                <Divider style={{ marginVertical: 12 }} />
              </>
            )}

            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
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
              style={{ backgroundColor: "#25375A" }}
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </Button>
            {!isSignUp && (
              <Button
                onPress={() => router.push("/auth/forgot-password")}
                textColor="#25375A"
              >
                Forgot password?
              </Button>
            )}

            <Button onPress={toggleForm}>
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account yet? Sign Up"}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#25375A" },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  authCard: { borderRadius: 16 },
  input: { marginBottom: 12 },
  row: { flexDirection: "row", gap: 10 },
  flex: { flex: 1 },
  radioRow: { flexDirection: "row", justifyContent: "space-between" },
  radioItem: { flexDirection: "row", alignItems: "center" },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
});
