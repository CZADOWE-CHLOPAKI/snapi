import { ReactNode } from "react";
import { SafeAreaView, Text } from "react-native";

type PageLayoutProps = {
  children: ReactNode;
  header?: string;
};
export const PageLayout = ({ children, header }: PageLayoutProps) => {
  return (
    <SafeAreaView className="h-full bg-gray-dark ">
      {header && (
        <Text className="text-white text-4xl m-12 mb-4">{header}</Text>
      )}
      {children}
    </SafeAreaView>
  );
};
