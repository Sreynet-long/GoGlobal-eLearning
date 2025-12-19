import AboutScreen from "../../components/screens/AboutScreen";
import AccountScreen from "../../components/screens/AccountScreen";
import { useAuth } from "../../context/AuthContext";

export default function AccountOrAbout() {
  const { isAuth, loading } = useAuth();

  if (loading) return null;
  return isAuth ? <AccountScreen /> : <AboutScreen />;
}
