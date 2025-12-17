import { useMutation, useQuery } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Paragraph,
  RadioButton,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import Topbar from "../../components/headers/Topbar";
import { useAuth } from "../../context/AuthContext";
import { GET_USER_BY_ID, MOBILE_UPDATE_USER } from "../../schema/login";

const COMPANY_ICON = "laptop-account";
const COMPANY_LOGO = require("../../assets/images/Go_Global_IT_logo.png");

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
  const [editing, setEditing] = useState(false);

  const {
    data: userData,
    refetch,
    loading: userLoading,
  } = useQuery(GET_USER_BY_ID);

  const [updateUser, { loading: updating }] = useMutation(MOBILE_UPDATE_USER, {
    onCompleted: () => {
      refetch?.();
      setEditing(false);
    },
    onError: (err) => console.error(err),
  });

  const user = userData?.getUserById || authUser || {};

  if (loading || userLoading) return null;

  const handleCall = () => Linking.openURL("tel:012660981");
  const handleEmail = () => Linking.openURL("mailto:goglobalit2022@gmail.com");

  const handleSave = (formData) => {
    updateUser({
      variables: {
        id: user._id,
        input: formData,
      },
    });
  };

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
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {isAuth ? (
              <AccountView
                user={user}
                editing={editing}
                setEditing={setEditing}
                handleSave={handleSave}
                updating={updating}
                logout={logout}
              />
            ) : (
              <AboutView
                theme={theme}
                handleCall={handleCall}
                handleEmail={handleEmail}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ------------------- Account View -------------------
function AccountView({
  user,
  editing,
  setEditing,
  handleSave,
  updating,
  logout,
}) {
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
          onPress={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </View>

      <Card style={styles.infoCard}>
        <Card.Title title="Account Information" titleStyle={styles.cardTitle} />
        <Card.Content>
          {editing ? (
            <EditUser
              initialData={user}
              onSave={handleSave}
              updating={updating}
            />
          ) : (
            <>
              <InfoRow
                label="First Name"
                value={user?.first_name}
                icon="person"
              />
              <InfoRow
                label="Last Name"
                value={user?.last_name}
                icon="person-outline"
              />
              <InfoRow label="Phone" value={user?.phone_number} icon="phone" />
              <InfoRow label="Gender" value={user?.gender} icon="wc" />
            </>
          )}
        </Card.Content>
      </Card>

      {editing ? null : (
        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButtonContained}
          textColor={COLORS.white}
        >
          Log Out
        </Button>
      )}
    </View>
  );
}

// ------------------- Edit User Component -------------------
function EditUser({ initialData, onSave, updating }) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    phone_number: initialData.phone_number || "",
    gender: initialData.gender || "male",
  });

  return (
    <View>
      <TextInput
        label="First Name"
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
        mode="flat"
        style={styles.inputField}
        autoFocus
      />
      <TextInput
        label="Last Name"
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
        mode="flat"
        style={styles.inputField}
      />
      <TextInput
        label="Phone Number"
        value={formData.phone_number}
        onChangeText={(text) =>
          setFormData({ ...formData, phone_number: text })
        }
        mode="flat"
        style={styles.inputField}
        keyboardType="phone-pad"
      />
      <RadioButton.Group
        onValueChange={(val) => setFormData({ ...formData, gender: val })}
        value={formData.gender}
      >
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
          <RadioButton.Item label="Male" value="male" />
          <RadioButton.Item label="Female" value="female" />
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={() => onSave(formData)}
        style={[
          styles.logoutButtonContained,
          { backgroundColor: COLORS.primary },
        ]}
        loading={updating}
        textColor={COLORS.white}
      >
        Save Changes
      </Button>
    </View>
  );
}

// ------------------- Info Row -------------------
function InfoRow({ label, value, icon }) {
  return (
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
}

// ------------------- About View -------------------
function AboutView({ theme, handleCall, handleEmail }) {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  const contactItems = [
    {
      key: "phone",
      label: "Call Us",
      value: "012 660 981",
      icon: "phone",
      onPress: () => Linking.openURL("tel:012660981"),
    },
    {
      key: "email",
      label: "Email",
      value: "goglobalit2022@gmail.com",
      icon: "email",
      onPress: () => Linking.openURL("mailto:goglobalit2022@gmail.com"),
    },
    {
      key: "website",
      label: "Website",
      value: "https://www.go-globalit.com/",
      icon: "link",
      onPress: () => Linking.openURL("https://www.go-globalit.com/"),
    },
    {
      key: "facebook",
      label: "Facebook",
      value:
        "https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d",
      icon: "facebook",
      onPress: () =>
        Linking.openURL(
          "https://www.facebook.com/profile.php?id=100090694682396&mibextid=LQQJ4d"
        ),
    },
  ];

  return (
    <ScrollView
      style={[
        styles.screenContainer,
        { backgroundColor: theme.colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={COMPANY_LOGO}
            style={[styles.logoImage, { borderColor: theme.colors.primary }]}
            resizeMode="contain"
          />
          <Title style={styles.mainTitle}>About Go eLEARNING</Title>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Our Story</Title>
            <Paragraph style={styles.paragraph}>
              Our company was first created within the company circles
              supervised by Go Global School. It initially started as an office
              focusing on IT & Marketing.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Later, in 2022, it evolved to become a dedicated company. We offer
              two main services: developing secure programmes and advanced
              algorithms to help our clients protect and efficiently store their
              critical information and data.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={[styles.missionVisionItem, styles.quoteContainer]}>
              <Title
                style={[styles.cardTitle, { color: theme.colors.primary }]}
              >
                Our Vision
              </Title>

              <View style={styles.mottoWrapper}>
                <View
                  style={[
                    styles.accentLine,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <Text
                  style={[styles.missionVisionText, { fontStyle: "italic" }]}
                >
                  "Let's move to the digital area."
                </Text>
              </View>
            </View>
            <View style={styles.missionVisionItem}>
              <Title
                style={[styles.cardTitle, { color: theme.colors.secondary }]}
              >
                Our Mission
              </Title>
              <Text style={styles.missionVisionText}>
                "Innovate, promote, and encourage using technology in digital
                lifestyle."
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.contactCard]}>
          <Card.Content>
            <Title style={styles.cardTitle}>Contact Us</Title>

            <View style={styles.contactIconRow}>
              {contactItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.contactIconButton}
                  onPress={() => toggleItem(item.key)}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={32}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.contactLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {openItem && (
              <View style={styles.contactValueContainer}>
                <Text
                  style={styles.contactValue}
                  onPress={contactItems.find((i) => i.key === openItem).onPress}
                >
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

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.primary },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 25 },
  card: { marginBottom: 20, borderRadius: 12, elevation: 2 },
  profileHeader: { marginTop: 70, alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    marginBottom: 10,
  },
  profileName: { fontSize: 26, fontWeight: "800", color: "#343a40" },
  profileEmail: { color: COLORS.grey600, fontSize: 14, marginBottom: 10 },
  editButtonLabel: { fontSize: 14, fontWeight: "700" },
  infoCard: {
    borderRadius: 16,
    marginBottom: 25,
    backgroundColor: COLORS.cardBackground,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    paddingTop: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: { fontSize: 15, color: COLORS.grey600, fontWeight: "600" },
  infoValue: { fontSize: 15, fontWeight: "700", color: "#212529" },
  logoutButtonContained: {
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 3,
    marginTop: 10,
    backgroundColor: COLORS.error,
  },
  logoIcon: { marginBottom: 5 },
  mainTitle: { fontSize: 28, fontWeight: "700" },
  paragraph: { lineHeight: 22, marginBottom: 10, fontSize: 15 },
  missionVisionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  missionVisionText: { fontSize: 16, fontStyle: "italic", paddingLeft: 10 },
  contactCard: { paddingVertical: 10 },
  contactIconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  contactIconButton: {
    alignItems: "center",
    width: 70,
  },
  contactValueContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  contactLabel: { fontSize: 12, textAlign: "center", marginTop: 4 },
  contactValue: {
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: "none",
    textAlign: "center",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    fontWeight: "bold",
  },
  inputField: { marginBottom: 10, backgroundColor: "transparent" },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 20,
  },
});
