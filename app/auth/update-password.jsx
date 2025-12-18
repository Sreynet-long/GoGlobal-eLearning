import { useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { UPDATE_NEW_PASSWORD } from "../../schema/login";

export default function UpdatePassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { language } = useLanguage();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [updatePassword, { loading }] = useMutation(UPDATE_NEW_PASSWORD, {
    onCompleted: (data) => {
      if (data?.updateNewPassword?.status) {
        router.replace("/myCourses&Login");
      } else {
        setError(
          language === "kh"
            ? data?.updateNewPassword?.message?.messageKh
            : data?.updateNewPassword?.message?.messageEn
        );
      }
    },
    onError: (err) => setError(err.message),
  });

  const handleUpdate = () => {
    if (!password || !confirmPassword) {
      setError(t("fill_both_fields", language));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwords_do_not_match", language));
      return;
    }
    setError("");
    updatePassword({ variables: { password, token } });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.title}>{t("new_password", language)}</Text>
          <Paragraph style={styles.paragraph}>
            {t("set_new_password", language)}
          </Paragraph>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            label={t("new_password", language)}
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TextInput
            label={t("confirm_password", language)}
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
            {t("update_password", language)}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

//==================== Styles ====================
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
  paragraph: {
    textAlign: "center",
    fontSize: 14,
  },
});
