import React, { createContext, useContext, useState, ReactNode } from 'react';

type VerficationModalContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerficationModalContext = createContext<
  VerficationModalContextType | undefined
>(undefined);

export const VerficationModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  console.log('open', open);

  return (
    <VerficationModalContext.Provider value={{ open, setOpen }}>
      {children}
    </VerficationModalContext.Provider>
  );
};

export const useVerficationModal = () => {
  const context = useContext(VerficationModalContext);
  if (!context) {
    throw new Error('verificxation modal error');
  }
  return context;
};
// 0904785303