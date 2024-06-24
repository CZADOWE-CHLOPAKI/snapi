import { ReactNode } from "react";
import { Text } from "react-native";

export const ThemedText = ({ children }: { children: ReactNode }) => {
  return <Text className="text-lg text-white">{children}</Text>;
};
