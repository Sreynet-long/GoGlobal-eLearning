// components/GlobalText.js
import { Text } from "react-native";

export default function GlobalText(props) {
  return <Text {...props} style={[{ fontFamily: "Siemreap" }, props.style]} />;
}
