import en from "./en";
import kh from "./kh";

const translations = { en, kh };

export const t = (key, lang) => {
  return translations[lang]?.[key] || key;
};
