import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type FavouriteContextType = {
  favourite: any[];
  setFavourite: React.Dispatch<React.SetStateAction<any[]>>;
};

const FavouriteContext = createContext<FavouriteContextType | undefined>(
  undefined
);

export const FavouriteProvider = ({ children }: { children: ReactNode }) => {
  const [favourite, setFavourite] = useState<any[]>(() => {
    // Load from localStorage only on initial render
    return JSON.parse(localStorage.getItem('favourite') || '[]');
  });

  useEffect(() => {
    // Save to localStorage when favourite changes
    localStorage.setItem('favourite', JSON.stringify(favourite));
  }, [favourite]);

  return (
    <FavouriteContext.Provider value={{ favourite, setFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error('useFavourite must be used within a FavouriteProvider');
  }
  return context;
};
