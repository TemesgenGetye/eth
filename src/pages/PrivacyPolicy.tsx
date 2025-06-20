import React from 'react';
import { useLanguage } from '../Context/Languge';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto mb-10 mt-10 max-w-3xl rounded bg-white p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">
        {t('common.privacyPolicy.title')}
      </h1>
      <p className="mb-4">{t('common.privacyPolicy.introduction')}</p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.collection.title')}
      </h2>
      <p className="mb-4">
        {t('common.privacyPolicy.sections.collection.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.usage.title')}
      </h2>
      <p className="mb-4">{t('common.privacyPolicy.sections.usage.content')}</p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.sharing.title')}
      </h2>
      <p className="mb-4">
        {t('common.privacyPolicy.sections.sharing.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.security.title')}
      </h2>
      <p className="mb-4">
        {t('common.privacyPolicy.sections.security.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.changes.title')}
      </h2>
      <p className="mb-4">
        {t('common.privacyPolicy.sections.changes.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.privacyPolicy.sections.contact.title')}
      </h2>
      <p>{t('common.privacyPolicy.sections.contact.content')}</p>
    </div>
  );
};

export default PrivacyPolicy;
