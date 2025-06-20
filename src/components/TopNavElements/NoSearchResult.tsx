import { useLanguage } from '../../Context/Languge';

function NoSearchResult({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const { t } = useLanguage();

  const defaultTitle = t('common.noSearchResultsTitle');
  const defaultMessage = t('common.noSearchResultsMessage');

  return (
    <div className="flex max-w-4xl items-center gap-10 rounded-md border border-[rgb(255,_229,_171)] bg-[rgb(255,_252,_244)] p-6">
      <div>
        <img
          src="/alert.gif"
          alt="alert"
          className="size-[100px] sm:size-[150px]"
        />
      </div>
      <div>
        <h1 className="text-xl font-bold">{title || defaultTitle}</h1>
        <p className="mt-5">{message || defaultMessage}</p>
      </div>
    </div>
  );
}

export default NoSearchResult;
