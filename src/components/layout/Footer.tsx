import React, { useState } from 'react';
// import { useLanguage } from '../../Context/Languge';
import InfoModal from '../ui/InfoModal';
import ContactIcons from '../ui/ContactIcons';
import toast from 'react-hot-toast';

const Footer = () => {
  // const { setLanguage } = useLanguage();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [countryModal, setCountryModal] = useState<{
    open: boolean;
    country: string | null;
  }>({ open: false, country: null });

  // const handleLanguageChange = (lang: string) => {
  //   // setLanguage(lang);
  //   // Add logic to change the language of the website
  // };

  return (
    <footer className="hidden bg-gray-100 px-4 py-8 md:block">
      {/* About Us Modal */}
      {aboutOpen && (
        <InfoModal
          open={aboutOpen}
          onClose={() => setAboutOpen(false)}
          title="About 888Market"
        >
          888Market is a leading online marketplace in the UAE, offering a wide
          range of products and services to customers across the region. Our
          mission is to provide a seamless, secure, and enjoyable shopping
          experience, connecting buyers and sellers with trust and convenience.
          We are committed to quality, customer satisfaction, and innovation in
          the e-commerce space.
        </InfoModal>
      )}
      {/* Contact Us Modal */}
      {contactOpen && (
        <InfoModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          title="Contact 888Market"
        >
          <div>
            For any inquiries, support, or feedback, please reach out to us
            through the following channels:
            <ContactIcons />
          </div>
        </InfoModal>
      )}
      {/* Country Coming Soon Modal */}
      {countryModal.open && (
        <InfoModal
          open={countryModal.open}
          onClose={() => setCountryModal({ open: false, country: null })}
          title={
            countryModal.country
              ? `${countryModal.country} - Coming Soon!`
              : 'Coming Soon!'
          }
        >
          <div className="flex flex-col items-center justify-center">
            <img
              src="/alert.gif"
              alt="Coming Soon"
              className="mb-4 h-32 w-32"
            />
            <p className="text-center text-lg font-semibold">
              We're working hard to bring 888Market to{' '}
              {countryModal.country || 'this country'}! Stay tuned for updates.
            </p>
          </div>
        </InfoModal>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Company Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Company</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setAboutOpen(true)}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setContactOpen(true)}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* UAE Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">UAE</h3>
            <ul
              className="space-y-2"
              onClick={() => {
                toast.success(
                  'We have product all around UAE select what you want to buy'
                );
              }}
            >
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
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'France' })
                  }
                >
                  France
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Spain' })
                  }
                >
                  Spain
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'USA' })
                  }
                >
                  USA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'China' })
                  }
                >
                  China
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Italy' })
                  }
                >
                  Italy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Turkey' })
                  }
                >
                  Turkey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Mexico' })
                  }
                >
                  Mexico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Germany' })
                  }
                >
                  Germany
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'United Kingdom' })
                  }
                >
                  United Kingdom
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() =>
                    setCountryModal({ open: true, country: 'Japan' })
                  }
                >
                  Japan
                </button>
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
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Whatsapp
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">Support</h3>
            <ul className="space-y-2">
              {/* <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Help
                </a>
              </li> */}
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setContactOpen(true)}
                >
                  Contact Us
                </button>
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
                  English
                </a>
              </li>
            </ul>
            <button
              // onClick={() => handleLanguageChange('am')}
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Switch to Arabic
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <img src="/logo.png" alt="Dubizzle Group" className="h-28" />
            <p className="mt-2 text-sm text-gray-500">
              © 888Market 2025, All Rights Reserved.
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
