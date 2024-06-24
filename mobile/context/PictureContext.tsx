import React, { ReactNode, createContext, useContext, useState } from "react";

type PictureContextType = {
  pictureFileLocation: string;
  setPictureFileLocation: React.Dispatch<React.SetStateAction<string>>;
};

const PictureContext = createContext<PictureContextType | undefined>(undefined);

export const PictureContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pictureFileLocation, setPictureFileLocation] = useState<string>("");

  return (
    <PictureContext.Provider
      value={{ pictureFileLocation, setPictureFileLocation }}
    >
      {children}
    </PictureContext.Provider>
  );
};

export const usePictureContext = () => {
  const context = useContext(PictureContext);
  if (context === undefined) {
    throw new Error(
      "usePictureContext must be used within a PictureContextProvider"
    );
  }
  return context;
};
