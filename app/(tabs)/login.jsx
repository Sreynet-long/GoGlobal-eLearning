import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Topbar from "../../components/headers/Topbar";

export default function login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  return (
    <View style={styles.screenContainer}>
      <Topbar />
      <View style={styles.contentContainer}>
        <View style={styles.Container}>
          <Text style={styles.title} variant="headlineMedium">
            {isSignUp ? "Sign Up" : "Log In"}
          </Text>
          {isSignUp && (
            <TextInput
              style={styles.input}
              label="Fist Name"
              autoCapitalize="none"
              placeholder=""
              mode="outlined"
            />
          )}
          {isSignUp && (
            <TextInput
              style={styles.input}
              label="Last Name"
              autoCapitalize="none"
              placeholder=""
              mode="outlined"
            />
          )}
          <TextInput
            style={styles.input}
            label="Email"
            autoCaptilized="none"
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
              : "Don't have an acccount? Sign Up"}
          </Button>
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
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 14,
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
});
