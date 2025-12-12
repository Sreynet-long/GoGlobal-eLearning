import { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";

export default function login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in al fields.");
      return;
    }

    if (password.length < 3) {
      setError("Password must be atleast 3 characters long.");
      return;
    }

    setError(null);
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <View style={styles.contentContainer}>
        <View style={styles.Container}>
          <KeyboardAvoidingView>
            <Text style={styles.title} variant="headlineMedium">
              {isSignUp ? "Sign Up" : "Log In"}
            </Text>

            {/* FIRST + LAST NAME IN ONE ROW */}
            {isSignUp && (
              <View style={styles.rowContainer}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  label="First Name"
                  autoCapitalize="none"
                  mode="outlined"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  label="Last Name"
                  autoCapitalize="none"
                  mode="outlined"
                />
              </View>
            )}

            {/* PHONE NUMBER FOR SIGN UP */}
            {isSignUp && (
              <TextInput
                style={styles.input}
                label="Phone Number"
                keyboardType="phone-pad"
                mode="outlined"
              />
            )}

            <TextInput
              style={styles.input}
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="example@gmail.com"
              mode="outlined"
            />

            <TextInput
              style={styles.input}
              label="Password"
              autoCapitalize="none"
              secureTextEntry
              mode="outlined"
            />

            {/* FORGOT PASSWORD FOR LOGIN */}
            {!isSignUp && (
              <Button
                mode="text"
                textColor="#fff"
                style={styles.forgotPassword}
              >
                Forgot Password?
              </Button>
            )}

            {/* TERMS & CONDITIONS FOR SIGN UP */}
            {isSignUp && (
              <View style={styles.checkboxContainer}>
                <Checkbox status="unchecked" />
                <Text style={styles.checkboxText}>
                  I agree to the Terms & Conditions
                </Text>
              </View>
            )}

            <Button style={styles.button} mode="contained">
              {isSignUp ? "Sign Up" : "Log In"}
            </Button>

            <Button
              style={styles.switchButton}
              mode="text"
              textColor="#fff"
              onPress={handleSwitchMode}
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Sign Up"}
            </Button>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#25375aff",
  },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
  },
  Container: {
    padding: 24,
    backgroundColor: "#25375A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(15px)",
    justifyContent: "center",
    margin: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },

  input: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 24,
    marginBottom: 16,
    color: "#ffffffff",
  },

  button: {
    paddingVertical: 14,
    backgroundColor: "#394a6bff",
    borderRadius: 14,
    marginBottom: 12,
  },

  switchButton: {
    marginTop: 12,
    alignSelf: "center",
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  checkboxText: {
    color: "#fff",
  },
});
