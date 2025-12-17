import { gql, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const VERIFY_OTP = gql`
  mutation VerifyOTP($otp: String!, $token: String!) {
    verifyOTP(otp: $otp, token: $token) {
      status
      message {
        messageKh
        messageEn
      }
      data {
        token
      }
    }
  }
`;

export default function VerifyOTP() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const [verifyOtp, { loading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data?.verifyOTP?.status && data?.verifyOTP?.data?.token) {
        router.push({
          pathname: "/auth/update-password",
          params: { token: data.verifyOTP.data.token },
        });
      } else {
        showError(
          data?.verifyOTP?.message?.messageEn ||
            "Incorrect code. Please try again!"
        );
      }
    },
    onError: (err) => showError(err.message),
  });

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      showError("Please enter all 6 digits.");
      return;
    }
    verifyOtp({ variables: { otp: otpCode, token } });
  };

  return (
    <View style={styles.contentContainer}>
      <Card>
        <Card.Content>
          <View style={styles.cardInner}>
            <Text style={styles.title}>Code Verification</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpInput}
                />
              ))}
            </View>

            <Button
              mode="contained"
              loading={loading}
              buttonColor="#25375A"
              textColor="#fff"
              onPress={handleVerify}
              style={{ marginTop: 12 }}
            >
              Verify
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  cardInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 50,
    height: 50,
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 5,
  },
});
