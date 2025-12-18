import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const AuthContext = createContext();

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
          const response = await fetchUserFromApi(token);
          setUser(response);
        } catch (err) {
          console.error(err);
        }
      }

      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token, fetchedUser = null) => {
    await setToken(token);
    setIsAuth(true);

    if (fetchedUser) setUser(fetchedUser);
  };

  const logout = async () => {
    await removeToken();
    setIsAuth(false);
    setUser(null);
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
