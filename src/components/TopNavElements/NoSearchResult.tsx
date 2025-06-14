function NoSearchResult({
  title = "We Couldn't find any results matching your criteria",
  message = 'Try broadening your search using filters',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex items-center max-w-4xl gap-10 rounded-md border border-[rgb(255,_229,_171)] bg-[rgb(255,_252,_244)] p-6">
      <div>
        <img src="/alert.gif" alt="alert" className="size-[150px]" />
      </div>
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-5">{message}</p>
      </div>
    </div>
  );
}

export default NoSearchResult;
