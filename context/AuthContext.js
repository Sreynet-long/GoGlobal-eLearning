import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      setIsAuth(!!token);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token) => {
    await setToken(token);
    setIsAuth(true); // immediately update tabs
  };

  const logout = async () => {
    await removeToken();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
