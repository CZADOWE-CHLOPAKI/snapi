import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";

const getTabOptions = (label: string) => {
  return {
    tabBarLabel: label,
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#4d4d4d",
    tabBarActiveBackgroundColor: "#171717",
    tabBarInactiveBackgroundColor: "#171717",
  };
};

const HomeTabs = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) =>
        Platform.OS === "ios" ? (
          <BlurView
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            tint={"light"}
            intensity={95}
          >
            <BottomTabBar {...props} />
          </BlurView>
        ) : (
          <BottomTabBar {...props} />
        )
      }
    >
      <Tabs.Screen
        name="home"
        options={{
          ...getTabOptions("home"),
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          ...getTabOptions("home"),
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="send" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default HomeTabs;
