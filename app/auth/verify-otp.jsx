import { gql, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Text } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

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
  const { language } = useLanguage();

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
          language === "kh"
            ? data?.verifyOTP?.message?.messageKh
            : data?.verifyOTP?.message?.messageEn ||
                t("incorrect_code", language)
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

    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      showError(t("enter_all_digits", language));
      return;
    }
    verifyOtp({ variables: { otp: otpCode, token } });
  };

  return (
    <View style={styles.contentContainer}>
      <Card>
        <Card.Content>
          <View style={styles.cardInner}>
            <Text style={styles.title}>{t("code_verification", language)}</Text>
            <Paragraph style={styles.paragraph}>
              {t("type_verification_code", language)}
            </Paragraph>
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
  
              textColor="#fff"
              onPress={handleVerify}
              style={{ marginTop: 12 }}
            >
              {t("verify", language)}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

//==================== Styles ====================
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
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
  paragraph: {
    textAlign: "center",
    fontSize: 14,
  },
});
