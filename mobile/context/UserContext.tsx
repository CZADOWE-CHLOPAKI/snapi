import { getData, storeData } from "@/utils/asyncStorage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>("");
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) {
        const storedToken = await getData("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } else {
        await storeData("token", token);
      }
    })();
  }, [token]);

  return (
    <UserContext.Provider value={{ userName, setUserName, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
