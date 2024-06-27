import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";

const getNavigationOptions = (title: string): NativeStackNavigationOptions => ({
  title,
  headerStyle: { backgroundColor: "#000" },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
});

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={getNavigationOptions("home") as any} />
      <Stack.Screen
        name="displayPhoto"
        options={getNavigationOptions("displayPhoto") as any}
      />
    </Stack>
  );
}
