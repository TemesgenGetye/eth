import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import SearchModal from '../components/ui/SearchModal';

interface SearchModalContextType {
  openSearchModal: (initialValue?: string) => void;
  closeSearchModal: () => void;
  isSearchModalOpen: boolean;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(
  undefined
);

export const useSearchModal = () => {
  const context = useContext(SearchModalContext);
  if (!context) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
};

interface SearchModalProviderProps {
  children: ReactNode;
}

export const SearchModalProvider = ({ children }: SearchModalProviderProps) => {
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const openSearchModal = (initialValue = '') => {
    setSearchValue(initialValue);
    setSearchModalOpen(true);
    if (window.location.hash !== '#search') {
      window.history.pushState(null, '', '#search');
    }
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
    if (window.location.hash === '#search') {
      window.history.back();
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (isSearchModalOpen && window.location.hash !== '#search') {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isSearchModalOpen]);

  const value = {
    openSearchModal,
    closeSearchModal,
    isSearchModalOpen,
  };

  return (
    <SearchModalContext.Provider value={value}>
      {children}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </SearchModalContext.Provider>
  );
};
