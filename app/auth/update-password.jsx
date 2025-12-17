import { useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { UPDATE_NEW_PASSWORD } from "../../schema/login";

export default function UpdatePassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [updatePassword, { loading }] = useMutation(UPDATE_NEW_PASSWORD, {
    onCompleted: (data) => {
      if (data?.updateNewPassword?.status) {
        router.replace("/"); // back to login
      } else {
        setError(data?.updateNewPassword?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleUpdate = () => {
    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Please fill out both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(""); // Clear any previous errors
    updatePassword({ variables: { password, token } });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.title}>New Password</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor="#25375A"
            textColor="#fff"
            loading={loading}
            onPress={handleUpdate}
          >
            Update Password
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  input: { marginBottom: 12 },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
});
