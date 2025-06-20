import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import { ProtectedRoute } from './pages/ProtectedRoute';
import MyAds from './pages/MyAds';
import PostAds from './pages/PostAds';
import OrderConformation from './pages/Order-configration';
import Favourites from './pages/Favourites';
import SearchResult from './pages/SearchResult';
import Motor from './pages/Motor';
import Property from './pages/Property';
import Furniture from './pages/Furniture';
import Classified from './pages/Classified';
import Job from './pages/Job';
import Community from './pages/Community';
import Phone from './pages/Phone';
import Catagory from './pages/Catagory';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Subscription from './pages/Subscription';
import Pricing from './pages/pricing';
import Chat from './pages/Chat';
import TopNav from './components/layout/TopNav';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ScrollToTop from './components/ui/ScrollToTop';
import { LanguageProvider } from './Context/Languge';
import CatagoryInfo from './pages/Catagory';

const AppContent = () => {
  const location = useLocation();
  const hideOnRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ];
  const profileRoute = '/profile';

  const shouldHideNavAndFooter = hideOnRoutes.includes(location.pathname);
  const isProfilePage = location.pathname.startsWith(profileRoute);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!shouldHideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:cname" element={<CatagoryInfo />} />
          <Route path="/:cname/search" element={<SearchResult />} />
          <Route path="/:cid/:pname" element={<Product />} />
          <Route path="/:cid/:pname/:pid" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="/post-ad" element={<PostAds />} />
          <Route path="/order-confirmation" element={<OrderConformation />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/motors" element={<Motor />} />
          <Route path="/property" element={<Property />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/classified" element={<Classified />} />
          <Route path="/job" element={<Job />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mobile-phones" element={<Phone />} />
          <Route path="/category" element={<Catagory />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
      {!shouldHideNavAndFooter && !isProfilePage && (
        <LanguageProvider>
          <Footer />
        </LanguageProvider>
      )}
      <MobileBottomNav />
    </div>
  );
};

export default AppContent;
