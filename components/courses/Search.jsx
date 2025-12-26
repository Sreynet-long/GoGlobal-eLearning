import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";

export default function Search({ value, onChange }) {
  const { language } = useLanguage();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search_placeholder", language)}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChange}
          autoCorrect={false}
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color="#888"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

//==================== Styles ====================

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  filterButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    backgroundColor: "#25375aff",
    borderRadius: 8,
  },
});
