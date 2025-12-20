import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Title, useTheme } from "react-native-paper";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

const COMPANY_LOGO = require("../../assets/images/Go_Global_IT_logo.png");
const COLORS = {
    primary: "#25375A",
    accent: "#D4AF37",
    background: "#F7F9FC",
    white: "#FFFFFF",
    grey300: "#E0E0E0",
    grey600: "#757575",
};

export default function AboutScreen() {
    const theme = useTheme();
    const { language } = useLanguage();
    const [openItem, setOpenItem] = useState(null);

    const toggleItem = (key) => setOpenItem(openItem === key ? null : key);

    const handleCall = () => Linking.openURL("tel:012660981");
    const handleEmail = () => Linking.openURL("mailto:goglobalit2022@gmail.com");

    const contactItems = [
        { key: "phone", label: t("call_us", language), value: "012 660 981", icon: "phone", onPress: handleCall },
        { key: "email", label: t("email", language), value: "goglobalit2022@gmail.com", icon: "email", onPress: handleEmail },
        { key: "website", label: t("website", language), value: "https://www.go-globalit.com/", icon: "link", onPress: () => Linking.openURL("https://www.go-globalit.com/") },
        { key: "facebook", label: t("facebook", language), value: "https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d", icon: "facebook", onPress: () => Linking.openURL("https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d") },
    ];

    return (
        <ScrollView style={[styles.screenContainer, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image source={COMPANY_LOGO} style={[styles.logoImage, { borderColor: theme.colors.primary }]} resizeMode="contain" />
                    <Title style={styles.mainTitle}>{t("about_go_elearning", language)}</Title>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>{t("our_story", language)}</Title>
                        <Text>{t("our_story_text1", language)}</Text>
                        <Text>{t("our_story_text2", language)}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={[styles.missionVisionItem, { paddingBottom: 0 }]}>
                            <Title style={[styles.cardTitle, { color: theme.colors.primary }]}>{t("our_vision", language)}</Title>
                            <Text style={styles.missionVisionText}>{t("our_vision_text", language)}</Text>
                        </View>
                        <View style={styles.missionVisionItem}>
                            <Title style={[styles.cardTitle, { color: theme.colors.secondary }]}>{t("our_mission", language)}</Title>
                            <Text style={styles.missionVisionText}>{t("our_mission_text", language)}</Text>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, styles.contactCard]}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>{t("contact_us", language)}</Title>
                        <View style={styles.contactIconRow}>
                            {contactItems.map((item) => (
                                <View key={item.key} style={styles.contactIconButton} onClick={() => toggleItem(item.key)}>
                                    <MaterialIcons name={item.icon} size={32} color={theme.colors.primary} />
                                    <Text style={styles.contactLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                        {openItem && (
                            <View style={styles.contactValueContainer}>
                                <Text style={styles.contactValue} onPress={contactItems.find((i) => i.key === openItem).onPress}>
                                    {contactItems.find((i) => i.key === openItem).value}
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

//==================== Styles ====================
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: COLORS.primary },
    contentContainer: { flex: 1, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 16 },
    card: { marginBottom: 20, borderRadius: 12, elevation: 2 },
    logoContainer: { alignItems: "center", justifyContent: "center", marginVertical: 20 },
    logoImage: { width: 80, height: 80, borderWidth: 2, borderRadius: 40, marginBottom: 20 },
    mainTitle: { fontSize: 28, fontWeight: "700", marginTop: "20" },
    cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, paddingTop: 20, textAlign: "center" },
    paragraph: { lineHeight: 22, marginBottom: 10, fontSize: 15 },
    missionVisionItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
    missionVisionText: { fontSize: 16, fontStyle: "italic", paddingLeft: 10 },
    contactCard: { paddingVertical: 10 },
    contactIconRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
    contactIconButton: { alignItems: "center", width: 70 },
    contactValueContainer: { marginTop: 10, alignItems: "center" },
    contactLabel: { fontSize: 12, textAlign: "center", marginTop: 4 },
    contactValue: { fontSize: 16, color: COLORS.primary, textDecorationLine: "none", textAlign: "center", borderTopWidth: 2, padding: 20, fontWeight: "bold" },
});
