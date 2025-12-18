// components/GlobalTextInput.js
import { TextInput } from "react-native";

export default function GlobalTextInput({ style, ...props }) {
  return <TextInput {...props} style={[{ fontFamily: "Siemreap" }, style]} />;
}
