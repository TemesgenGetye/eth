import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './Context/AuthContext';
import { BlurBackgroundProvider as BackgroundProvider } from './Context/BlurBackground';
import { CartProvider } from './Context/Cart';
import { FavouriteProvider } from './Context/Favourite';
import { SearchModalProvider } from './Context/SearchModalContext';

import AppContent from './AppContent';
import { LanguageProvider } from './Context/Languge';
import { VerficationModalProvider } from './Context/VerficationModal';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Toaster />
        <Router>
          <AuthProvider>
            <VerficationModalProvider>
              <BackgroundProvider>
                <CartProvider>
                  <FavouriteProvider>
                    <SearchModalProvider>
                      <AppContent />
                    </SearchModalProvider>
                  </FavouriteProvider>
                </CartProvider>
              </BackgroundProvider>
            </VerficationModalProvider>
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
