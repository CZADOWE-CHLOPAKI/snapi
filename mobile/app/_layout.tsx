import { PictureContextProvider } from "@/context/PictureContext";
import { PushNotificationsProvider } from "@/context/PushNotificationContext";
import { UserContextProvider } from "@/context/UserContext";

import { Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
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
    <RootSiblingParent>
      <PushNotificationsProvider>
        <PictureContextProvider>
          <UserContextProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="test"
                options={getNavigationOptions("test") as any}
              />
              <Stack.Screen
                name="test_gl"
                options={getNavigationOptions("test") as any}
              />
              <Stack.Screen
                name="login"
                options={getNavigationOptions("login") as any}
              />
              <Stack.Screen
                name="register"
                options={getNavigationOptions("register") as any}
              />
              <Stack.Screen name="tabs" />
            </Stack>
          </UserContextProvider>
        </PictureContextProvider>
      </PushNotificationsProvider>
    </RootSiblingParent>
  );
}
