// context/AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const AuthContext = createContext();

// ------------------- Mock API Call -------------------
const fetchUserFromApi = async (token) => {
  // Replace this with your real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "1", name: "John Doe", email: "john@example.com" });
    }, 500);
  });
};

// ------------------- Auth Provider -------------------
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const setToken = async (token) => {
    if (Platform.OS === "web") localStorage.setItem("token", token);
    else await AsyncStorage.setItem("token", token);
  };

  const getToken = async () => {
    if (Platform.OS === "web") return localStorage.getItem("token");
    return await AsyncStorage.getItem("token");
  };

  const removeToken = async () => {
    if (Platform.OS === "web") localStorage.removeItem("token");
    else await AsyncStorage.removeItem("token");
  };

  // ------------------- Initialize Auth -------------------
  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      setIsAuth(!!token);

      if (token) {
        try {
          const fetchedUser = await fetchUserFromApi(token);
          setUser(fetchedUser);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          await removeToken();
          setIsAuth(false);
          setUser(null);
          // router.replace("/auth");
        }
      } else {
        // router.replace("/auth");
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // ------------------- Login -------------------
  const login = async (token, fetchedUser = null) => {
    await setToken(token);
    setIsAuth(true);
    if (fetchedUser) setUser(fetchedUser);
    router.replace("/");
  };

  // ------------------- Logout -------------------
  const logout = async () => {
    await removeToken();
    setIsAuth(false);
    setUser(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, loading, login, logout, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
