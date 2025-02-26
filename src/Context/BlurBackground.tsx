import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
type BlurBackgroundContextType = {
  blurBackground: boolean;
  setBlurBackground: (blurBackground: boolean) => void;
};

// Create the context with an initial undefined value
const BlurBackgroundContext = createContext<
  BlurBackgroundContextType | undefined
>(undefined);

// Define the provider component
export const BlurBackgroundProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [blurBackground, setBlurBackground] = useState(false);

  return (
    <BlurBackgroundContext.Provider
      value={{ blurBackground, setBlurBackground }}
    >
      {children}
    </BlurBackgroundContext.Provider>
  );
};

// Custom hook to use the blur background context
export const useBackground = () => {
  const context = useContext(BlurBackgroundContext);
  if (context === undefined) {
    throw new Error(
      'useBackground must be used within a BlurBackgroundProvider'
    );
  }
  return context;
};
