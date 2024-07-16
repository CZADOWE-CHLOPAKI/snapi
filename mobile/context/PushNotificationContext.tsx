import { usePushNotifications } from "@/hooks/usePushNotifications";
import React, { ReactNode, createContext, useContext } from "react";

type PushNotificationsContextType = {
  pushToken: string;
};

const PushNotificationsContext = createContext<
  PushNotificationsContextType | undefined
>(undefined);

export const PushNotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { expoPushToken } = usePushNotifications();

  return (
    <PushNotificationsContext.Provider value={{ pushToken: expoPushToken }}>
      {children}
    </PushNotificationsContext.Provider>
  );
};

export const usePushNofiticationContext = () => {
  const context = useContext(PushNotificationsContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
