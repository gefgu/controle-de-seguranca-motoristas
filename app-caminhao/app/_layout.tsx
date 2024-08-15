import { View, Text } from "react-native";
import { Slot, type ErrorBoundaryProps } from "expo-router";

// Re-export the default UI
export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return <Slot />;
}
