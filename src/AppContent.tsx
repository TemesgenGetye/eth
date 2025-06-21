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
import Catagory from './pages/Catagory';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Subscription from './pages/Subscription';
import Pricing from './pages/pricing';
import Chat from './pages/Chat';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ScrollToTop from './components/ui/ScrollToTop';
import CatagoryInfo from './pages/Catagory';
import Menu from './pages/Menu';

const AppContent = () => {
  const location = useLocation();
  const hideAllNavOnRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/chats',
    '/subscription',
    '/pricing',
  ];
  const hideNavbarOnlyRoutes = ['/menu'];
  const profileRoute = '/profile';

  const shouldHideAllNav = hideAllNavOnRoutes.includes(location.pathname);
  const shouldHideNavbar =
    shouldHideAllNav || hideNavbarOnlyRoutes.includes(location.pathname);
  const isProfilePage = location.pathname.startsWith(profileRoute);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!shouldHideNavbar && <Navbar />}
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
          <Route
            path="/post-ad"
            element={
              <ProtectedRoute>
                <PostAds />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirmation" element={<OrderConformation />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/category" element={<Catagory />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/chats" element={<Chat />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
      {!shouldHideAllNav && !isProfilePage && <Footer />}
      {!shouldHideAllNav && <MobileBottomNav />}
    </div>
  );
};

export default AppContent;
