import { useQuery } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  IconButton,
  Paragraph,
  Text,
  Title,
  useTheme,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { GET_USER_BY_ID } from "../../schema/login";

const COMPANY_ICON = "laptop-account";

const handleCall = () => {
  Linking.openURL("tel:012660981");
};

const handleEmail = () => {
  Linking.openURL("mailto:goglobalit2022@gmail.com");
};

const COLORS = {
  primary: "#25375A",
  accent: "#D4AF37",
  background: "#F7F9FC",
  white: "#FFFFFF",
  error: "#D32F2F",
  textDark: "#212121",
  textLight: "#FFFFFF",
  grey300: "#E0E0E0",
  grey600: "#757575",
  cardBackground: "#FFFFFF",
  borderLight: "#e9ecef",
};

export default function AccountOrAbout() {
  const theme = useTheme();
  const { isAuth, loading, user: authUser, logout } = useAuth();

  const {
    data: userData,
    refetch: refetchUser,
    loading: userLoading,
  } = useQuery(GET_USER_BY_ID, {
    skip: !isAuth,
    variables: { id: authUser?.id },
  });

  useEffect(() => {
    if (isAuth) {
      refetchUser?.();
    }
  }, [isAuth]);

  if (loading || userLoading) return null;

  const user = userData?.getUserById || authUser;

  const InfoWithIcon = ({ label, value, icon }) => (
    <View style={styles.infoRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={COLORS.grey600}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Topbar />

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {isAuth ? renderAccount() : renderAbout()}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );

  function renderAbout() {
    return (
      <ScrollView
        style={[
          styles.screenContainer,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <IconButton
              icon={COMPANY_ICON}
              size={80}
              color={theme.colors.primary}
              style={styles.logoIcon}
            />
            <Title style={styles.mainTitle}>About Go Global IT</Title>
          </View>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Our Story</Title>
              <Paragraph style={styles.paragraph}>
                Our company was first created within the company circles
                supervised by Go Global School. It initially started as an
                office focusing on IT & Marketing.
              </Paragraph>
              <Paragraph style={styles.paragraph}>
                Later, in 2022, it evolved to become a dedicated company. We
                offer two main services: developing secure **programmes** and
                advanced algorithms to help our clients protect and efficiently
                store their critical information and data within their
                organizations.
              </Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.missionVisionItem}>
                <Title
                  style={[styles.cardTitle, { color: theme.colors.primary }]}
                >
                  Our Vision
                </Title>
                <Text style={styles.missionVisionText}>
                  "Let's move to the digital area."
                </Text>
              </View>

              <View style={styles.missionVisionItem}>
                <Title
                  style={[styles.cardTitle, { color: theme.colors.secondary }]}
                >
                  Our Mission
                </Title>
                <Text style={styles.missionVisionText}>
                  "Innovate, promote, and encourage in using technology in
                  digital lifestyle."
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.contactCard]}>
            <Card.Content>
              <Title style={styles.cardTitle}>Talk to Us</Title>

              <View style={styles.contactRow}>
                <IconButton
                  icon="phone"
                  size={24}
                  color={theme.colors.primary}
                  onPress={handleCall}
                />
                <View>
                  <Text style={styles.contactLabel}>Call Us</Text>
                  <Text style={styles.contactValue} onPress={handleCall}>
                    012 660 981
                  </Text>
                </View>
              </View>

              <View style={styles.contactRow}>
                <IconButton
                  icon="email"
                  size={24}
                  color={theme.colors.primary}
                  onPress={handleEmail}
                />
                <View>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue} onPress={handleEmail}>
                    goglobalit2022@gmail.com
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    );
  }

  function renderAccount() {
    return (
      <View>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                user?.profile_image ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

          <Button
            mode="text"
            textColor={COLORS.primary}
            labelStyle={styles.editButtonLabel}
            onPress={() => {}}
          >
            Edit Profile
          </Button>
        </View>

        <Card style={styles.infoCard}>
          <Card.Title
            title="Account Information"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <InfoWithIcon
              label="First Name"
              value={user?.first_name}
              icon="person"
            />
            <InfoWithIcon
              label="Last Name"
              value={user?.last_name}
              icon="person-outline"
            />
            <InfoWithIcon
              label="Phone"
              value={user?.phone_number}
              icon="phone"
            />
            <InfoWithIcon label="Gender" value={user?.gender} icon="wc" />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButtonContained}
          textColor={COLORS.white}
        >
          Log Out
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  profileHeader: {
    marginTop: 70,
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#343a40",
  },
  profileEmail: {
    color: COLORS.grey600,
    fontSize: 14,
    marginBottom: 10,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 25,
    backgroundColor: COLORS.cardBackground,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.grey600,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212529",
  },
  logoutButtonContained: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 3,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  logoIcon: {
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: 10,
    fontSize: 15,
  },
  missionVisionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  missionVisionText: {
    fontSize: 16,
    fontStyle: "italic",
    paddingLeft: 10,
  },
  contactCard: {
    paddingVertical: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  contactLabel: {
    fontSize: 12,
    color: "gray",
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
