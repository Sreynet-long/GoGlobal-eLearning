import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import Topbar from "../../components/headers/Topbar";

export default function UserProfileScreen() {
  return (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      <Topbar />
      <View style={styles.contentContainer}>
        <View style={styles.headerWrapper}>
          <View style={styles.cover} />
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Eve Student</Text>
          <Text style={styles.subtitle}>Learner • Progressing Daily</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>78%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Certificates</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Settings Section */}
        <Card style={styles.card}>
          <Card.Title title="Account Settings" />
          <Card.Content>
            <Button mode="text" style={styles.option}>
              Edit Profile
            </Button>
            <Button mode="text" style={styles.option}>
              Notifications
            </Button>
            <Button mode="text" style={styles.option}>
              Privacy & Security
            </Button>
            <Button mode="text" style={styles.option}>
              Language
            </Button>
          </Card.Content>
        </Card>

        <Button mode="contained" style={styles.logoutButton}>
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#25375aff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
  },
  headerWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    marginBottom: 50,
  },
  cover: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    height: 140,
    backgroundColor: "#4b7bec",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginTop: -55,
    borderWidth: 4,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6e6e6e",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 15,
    paddingBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  option: {
    alignItems: "flex-start",
  },
  logoutButton: {
    margin: 20,
    paddingVertical: 6,
    backgroundColor: "#eb3b5a",
  },
});
