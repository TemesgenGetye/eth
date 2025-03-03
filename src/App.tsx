import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Motor from './pages/Motor';
import { LanguageProvider } from './Context/Languge';
import Property from './pages/Property';
import Job from './pages/Job';
import Classified from './pages/Classified';
import Phone from './pages/Phone';
import Furniture from './pages/Furniture';
import Community from './pages/Community';
import Detail from './pages/Detail';
import Try from './pages/Try';
import { BlurBackgroundProvider } from './Context/BlurBackground';
import CatagoryInfo from './pages/Catagory';
import Product from './pages/Product';
import ScrollToTop from './components/ui/ScrollToTop';
import { FavouriteProvider } from './Context/Favourite';
import Favourites from './pages/Favourites';
import Cart from './pages/Cart';
import { CartProvider } from './Context/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmationPage from './pages/Order-configration';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <FavouriteProvider>
          <BlurBackgroundProvider>
            <Router>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className={`flex-grow `}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:id" element={<CatagoryInfo />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                      path="/order-confirmation"
                      element={<OrderConfirmationPage />}
                    />

                    <Route path="/motor" element={<Motor />}>
                      <Route index element={<Try />} />
                    </Route>
                    <Route path="/property" element={<Property />} />
                    <Route path="/job" element={<Job />} />
                    <Route path="/classified" element={<Classified />} />
                    <Route path="/phone" element={<Phone />} />
                    <Route path="/furniture" element={<Furniture />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="*" element={<div>404</div>} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </BlurBackgroundProvider>
        </FavouriteProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
