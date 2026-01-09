import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text as RNText,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  white: "#FFFFFF",
  slate: "#64748B",
  bgLight: "#F8FAFC",
  grey200: "#E2E8F0",
};

export default function ContactUsScreen() {
  const router = useRouter();
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!name || !email || !message) {
      return Alert.alert(
        t("error", language) || "Error",
        t("fill_all_fields", language) || "Please fill all fields"
      );
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        t("success", language) || "Success",
        t("message_sent_success", language) || "Message sent successfully"
      );
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  const contactMethods = [
    {
      icon: "phone",
      label: t("call_us", language) || "Call Us",
      val: "012 660 981",
      link: "tel:012660981",
      color: "#3b82f6",
    },
    {
      icon: "email",
      label: t("email", language) || "Email",
      val: "IT Support",
      link: "mailto:goglobalit2022@gmail.com",
      color: "#ef4444",
    },
    {
      icon: "location-on",
      label: t("office", language) || "Office",
      val: "Siem Reap",
      link: "https://maps.google.com",
      color: "#10b981",
    },
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/account&Aboutus");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <View style={styles.headerCenteredContent}>
            <View style={styles.iconGlow}>
              <MaterialIcons
                name="ring-volume"
                size={40}
                color={COLORS.accent}
              />
            </View>
            <Text style={styles.headerTitle}>
              {t("contact_us", language) || "Contact Us"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {t("well_provide_u_with_the_best_service_possible", language) ||
                "We'll provide you with the best service possible"}
            </Text>
          </View>
        </View>

        <View style={styles.accentBackgroundLayer}>
          <Surface style={styles.body} elevation={0}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { flexGrow: 1, minHeight: "100%" },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.methodGrid}>
                {contactMethods.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.methodCard,
                      index < contactMethods.length - 1
                        ? { marginRight: 12 }
                        : null,
                    ]}
                    onPress={() => Linking.openURL(item.link)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: item.color + "15" },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={22}
                        color={item.color}
                      />
                    </View>
                    <Text style={styles.methodLabel}>{item.label || ""}</Text>
                    <Text style={styles.methodValue}>{item.val || ""}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Surface style={styles.formSurface} elevation={0}>
                <Text style={styles.formTitle}>
                  {t("send_a_message", language) || "Send a Message"}
                </Text>

                <TextInput
                  label={t("full_name", language) || "Full Name"}
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                />

                <TextInput
                  label={t("email_address", language) || "Email Address"}
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                />

                <TextInput
                  label={t("your_message", language) || "Your Message"}
                  value={message}
                  onChangeText={setMessage}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={[styles.input, { height: 110 }]}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor={COLORS.primary}
                />

                <Button
                  mode="contained"
                  onPress={handleSendMessage}
                  loading={loading}
                  style={styles.sendButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  <RNText>
                    {t("send_message", language) || "Send Message"}
                  </RNText>
                </Button>
              </Surface>

              <View style={styles.socialContainer}>
                <Text style={styles.socialText}>
                  {t("follow_us_on_social_media", language) ||
                    "Follow us on social media"}
                </Text>
                <View style={styles.socialIcons}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://facebook.com")}
                  >
                    <Surface style={styles.socialBtn} elevation={1}>
                      <MaterialIcons
                        name="facebook"
                        size={24}
                        color={COLORS.primary}
                      />
                    </Surface>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://linkedin.com")}
                  >
                    <Surface style={styles.socialBtn} elevation={1}>
                      <MaterialIcons
                        name="language"
                        size={24}
                        color={COLORS.primary}
                      />
                    </Surface>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 30 : 25,
    paddingBottom: 30,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 25 : 15,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenteredContent: { alignItems: "center" },
  iconGlow: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 5,
    borderColor: COLORS.accent,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 50,
    lineHeight: 22,
  },
  accentBackgroundLayer: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 6,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 40 },
  methodGrid: { flexDirection: "row", marginBottom: 20 },
  methodCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginRight: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  methodLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.slate,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  methodValue: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 2,
    textAlign: "center",
  },
  formSurface: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 15,
  },
  input: { marginBottom: 12, backgroundColor: COLORS.white },
  inputOutline: { borderRadius: 14, borderColor: COLORS.grey200 },
  sendButton: {
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  buttonContent: { height: 54 },
  buttonLabel: { fontSize: 16, fontWeight: "700", paddingTop: 3, alignSelf: "center" },
  socialContainer: { alignItems: "center", marginTop: 35 },
  socialText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.slate,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  socialIcons: { flexDirection: "row" },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
});
