import {
  BottomTabBar,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";

const getTabOptions = (): BottomTabNavigationOptions => {
  return {
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "#171717",
    },
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
          ...getTabOptions(),
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          ...getTabOptions(),
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign name="camerao" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          ...getTabOptions(),
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign name="adduser" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          ...getTabOptions(),
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default HomeTabs;
