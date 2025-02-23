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

function App() {
  return (
    <LanguageProvider>
      <BlurBackgroundProvider>
        <Router>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className={`flex-grow `}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<CatagoryInfo />} />
                <Route path="/motor" element={<Motor />}>
                  <Route index element={<Try />} />
                  <Route path="/motor/:id" element={<Detail />} />
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
    </LanguageProvider>
  );
}

export default App;
