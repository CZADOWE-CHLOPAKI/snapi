import {
  BottomTabBar,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useMyProfile } from "@/hooks/useMyProfile";
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

const Header = ({ tag }: { tag?: string }) => {
  const onSettingsClick = () => {
    router.push("/settings");
  };
  return (
    <View className="w-full h-20 border-b pb-2 border-gray-light bg-gray-dark flex flex-row  justify-between items-end px-4">
      <Text className="text-white text-xl">hi {tag}</Text>
      <Pressable onPress={onSettingsClick}>
        <Ionicons name="settings-outline" size={24} color={"white"} />
      </Pressable>
    </View>
  );
};

const HomeTabs = () => {
  const { myProfile } = useMyProfile();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        header: () => <Header tag={myProfile?.tag} />,
      }}
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
    </Tabs>
  );
};
export default HomeTabs;
