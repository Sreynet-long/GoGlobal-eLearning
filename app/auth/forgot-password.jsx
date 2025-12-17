import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { FORGOT_PASSWORD } from "../../schema/login";

export default function ForgotPassword() {
  const router = useRouter();
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
        setError(data?.forgotPassword?.message?.messageEn);
      }
    },
    onError: (err) => setError(err.message),
  });

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.title}>Forgot Password?</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Button
            mode="contained"
            loading={loading}
            buttonColor="#25375A"
            textColor="#fff"
            onPress={() => forgotPassword({ variables: { email } })}
          >
            Send OTP
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
