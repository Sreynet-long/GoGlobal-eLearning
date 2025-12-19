import LoginScreen from "../../components/screens/LoginScreen";
import MyCourseScreen from "../../components/screens/MyCourseScreen";
import { useAuth } from "../../context/AuthContext";

export default function AccountOrAbout() {
  const { isAuth, loading } = useAuth();

  if (loading) return null;
  return isAuth ? <MyCourseScreen /> : <LoginScreen />;
}
