import { ReactNode } from "react";
import { SafeAreaView } from "react-native";

export const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView className="h-full bg-gray-dark ">{children}</SafeAreaView>
  );
};
