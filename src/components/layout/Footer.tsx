import React, { useState } from 'react';
import { useLanguage } from '../../Context/Languge';
import InfoModal from '../ui/InfoModal';
import ContactIcons from '../ui/ContactIcons';
import toast from 'react-hot-toast';

const Footer = () => {
  const { setLanguage, t, language } = useLanguage();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [countryModal, setCountryModal] = useState<{
    open: boolean;
    country: string | null;
  }>({ open: false, country: null });

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    toast.success(
      lang === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English'
    );
  };

  const getLocalizedCountryName = (country: string) => {
    const key = country.toLowerCase().replace(/\s+/g, '');
    return t(`common.footer.${key}`);
  };

  return (
    <footer
      className="hidden bg-gray-100 px-4 py-8 md:block"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* About Us Modal */}
      {aboutOpen && (
        <InfoModal
          open={aboutOpen}
          onClose={() => setAboutOpen(false)}
          title={`${t('common.aboutUs')} ${t('common.brandName')}`}
        >
          {t('common.brandName')} {t('common.footer.aboutDescription')}
        </InfoModal>
      )}
      {/* Contact Us Modal */}
      {contactOpen && (
        <InfoModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          title={`${t('common.contactUs')} ${t('common.brandName')}`}
        >
          <div>
            {t('common.footer.contactDescription')}
            <ContactIcons />
          </div>
        </InfoModal>
      )}
      {/* Country Coming Soon Modal */}
      {countryModal.open && countryModal.country && (
        <InfoModal
          open={countryModal.open}
          onClose={() => setCountryModal({ open: false, country: null })}
          title={`${getLocalizedCountryName(countryModal.country)} ${t('common.footer.willBeAvailableSoon')}`}
          country={countryModal.country}
        >
          <div>
            <p className="mb-4">
              {t('common.footer.countryComingSoon')}{' '}
              {getLocalizedCountryName(countryModal.country)}{' '}
              {t('common.footer.willBeAvailableSoon')}
            </p>
            <p>
              {t('common.footer.stayTunedForUpdates')} {t('common.brandName')}{' '}
              {t('common.footer.inCountry')}{' '}
              {getLocalizedCountryName(countryModal.country)}!
            </p>
          </div>
        </InfoModal>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Company Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.company')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setAboutOpen(true)}
                >
                  {t('common.aboutUs')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setContactOpen(true)}
                >
                  {t('common.contactUs')}
                </button>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-blue-400 hover:underline"
                >
                  {t('common.termsOfService')}
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-blue-400 hover:underline"
                >
                  {t('common.privacyPolicyy')}
                </a>
              </li>
            </ul>
          </div>

          {/* UAE Column */}
          <div
            onClick={() => {
              toast.success(
                'we have products all around dubai search what ever you want'
              );
            }}
          >
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.footer.uae')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.dubaii')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.abuDhabi')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.sharjah')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.ajman')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.rasAlKhaimah')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.fujairah')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.ummAlQuwain')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.alAin')}
                </a>
              </li>
            </ul>
          </div>

          {/* Other Countries Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.footer.otherCountries')}
            </h3>
            <ul className="space-y-2">
              {[
                'France',
                'Spain',
                'USA',
                'China',
                'Italy',
                'Turkey',
                'Mexico',
                'Germany',
                'Japan',
              ].map((country) => (
                <li key={country}>
                  <button
                    type="button"
                    className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                    onClick={() => setCountryModal({ open: true, country })}
                  >
                    {getLocalizedCountryName(country)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Social Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.footer.getSocial')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.footer.facebook')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.footer.twitter')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.footer.instagram')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.footer.linkedin')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.footer.youtube')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm text-blue-400 hover:underline"
                  onClick={() => setContactOpen(true)}
                >
                  {t('common.contactUs')}
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.callUs')}
                </a>
              </li>
            </ul>
          </div>

          {/* Languages Column */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-700">
              {t('common.languages')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  {t('common.english')}
                </a>
              </li>
            </ul>
            <button
              onClick={() =>
                handleLanguageChange(language === 'en' ? 'ar' : 'en')
              }
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {language === 'ar'
                ? t('common.switchToArabic')
                : t('common.switchToEnglish')}
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <img src="/logo.png" alt={t('common.logoAlt')} className="h-28" />
            <p className="mt-2 text-sm text-gray-500">
              {t('common.copyright')}
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
