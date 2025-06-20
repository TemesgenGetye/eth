import React from 'react';
import { useLanguage } from '../Context/Languge';

const TermsOfUse: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto mb-10 mt-10 max-w-3xl rounded bg-white p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">
        {t('common.termsOfUse.title')}
      </h1>
      <p className="mb-4">{t('common.termsOfUse.welcome')}</p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.acceptance.title')}
      </h2>
      <p className="mb-4">
        {t('common.termsOfUse.sections.acceptance.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.responsibilities.title')}
      </h2>
      <p className="mb-4">
        {t('common.termsOfUse.sections.responsibilities.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.prohibited.title')}
      </h2>
      <p className="mb-4">
        {t('common.termsOfUse.sections.prohibited.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.intellectual.title')}
      </h2>
      <p className="mb-4">
        {t('common.termsOfUse.sections.intellectual.content')}
      </p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.changes.title')}
      </h2>
      <p className="mb-4">{t('common.termsOfUse.sections.changes.content')}</p>

      <h2 className="mb-2 mt-6 text-xl font-semibold">
        {t('common.termsOfUse.sections.contact.title')}
      </h2>
      <p>{t('common.termsOfUse.sections.contact.content')}</p>
    </div>
  );
};

export default TermsOfUse;
