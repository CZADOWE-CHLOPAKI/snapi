import { PictureContextProvider } from "@/context/PictureContext";
import { UserContextProvider } from "@/context/UserContext";

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

export default function RootLayout() {
  return (
    <PictureContextProvider>
      <UserContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="camera"
            options={getNavigationOptions("camera") as any}
          />
          <Stack.Screen
            name="pictureEditor"
            options={getNavigationOptions("picture editor") as any}
          />
          <Stack.Screen
            name="sendPicture"
            options={getNavigationOptions("send editor") as any}
          />
        </Stack>
      </UserContextProvider>
    </PictureContextProvider>
  );
}
