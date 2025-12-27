import en from "./en";
import kh from "./kh";

const translations = { en, kh };

export const t = (key, lang = "en") => {
  const value = translations?.[lang]?.[key];

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return String(key ?? "");
};
