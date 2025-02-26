import { useLanguage } from '../../Context/Languge';

const Footer = () => {
  const { setLanguage } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Add logic to change the language of the website
  };

  return (
    <footer className="bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Company Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Advertising
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* UAE Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">UAE</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Dubai
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Abu Dhabi
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Ras Al Khaimah
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Sharjah
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Fujairah
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Ajman
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Umm Al Quwain
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Al Ain
                </a>
              </li>
            </ul>
          </div>

          {/* Other Countries Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              Other Countries
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Egypt
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Bahrain
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Saudi Arabia
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Lebanon
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Kuwait
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Oman
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Qatar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Pakistan
                </a>
              </li>
            </ul>
          </div>

          {/* Get Social Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Get Social</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Youtube
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Call Us
                </a>
              </li>
            </ul>
          </div>

          {/* Languages Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Languages</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  አማርኛ
                </a>
              </li>
            </ul>
            <button
              onClick={() => handleLanguageChange('am')}
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Switch to Amharic
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <img src="./logo.png" alt="Dubizzle Group" className="h-28" />
            <p className="mt-2 text-sm text-gray-500">
              © dubizzle.com 2025, All Rights Reserved.
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
