import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem("language");
        if (saved) setLanguage(saved);
      } catch (e) {
        console.warn("Failed to load language");
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    if (lang === language) return;
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
