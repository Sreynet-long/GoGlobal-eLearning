// context/AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import client from "../lib/apolloClient";

const AuthContext = createContext();

// ==================== Helper: Storage Abstraction ====================
const storage = Platform.OS === "web" ? localStorage : AsyncStorage;

const setToken = async (token) => {
  if (Platform.OS === "web") storage.setItem("token", token);
  else await storage.setItem("token", token);
};

const getToken = async () => {
  if (Platform.OS === "web") return storage.getItem("token");
  return await storage.getItem("token");
};

const removeToken = async () => {
  if (Platform.OS === "web") storage.removeItem("token");
  else await storage.removeItem("token");
};

// ==================== Mock API Call ====================
const fetchUserFromApi = async (token) => {
  // Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "1", name: "John Doe", email: "john@example.com" });
    }, 500);
  });
};

// ==================== Auth Provider ====================
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==================== Initialize Auth ====================
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          const fetchedUser = await fetchUserFromApi(token);
          setUser(fetchedUser);
          setIsAuth(true);
        } else {
          setUser(null);
          setIsAuth(false);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        await removeToken();
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // ==================== Login ====================
  const login = async (token, fetchedUser = null) => {
    try {
      await setToken(token);
      setIsAuth(true);
      if (fetchedUser) setUser(fetchedUser);
      router.replace("/"); // Redirect to home after login
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // ==================== Logout ====================
  const logout = async () => {
    try {
      await removeToken();
      await client.clearStore(); // Clear Apollo cache
      setIsAuth(false);
      setUser(null);
      router.replace("/"); // SPA redirect to home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==================== Hook ====================
export const useAuth = () => useContext(AuthContext);
