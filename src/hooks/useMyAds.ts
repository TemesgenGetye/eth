import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/products';

const useMyAds = (id: number) => {
  const {
    data: myAdds,
    isLoading: isLoadingAds,
    isError: isErrorAds,
    refetch: refetchAds,
  } = useQuery({
    queryKey: ['my-ads'],
    queryFn: () => getAds(id),
  });
  console.log('myAdds', myAdds);
  return { myAdds, isLoadingAds, isErrorAds, refetchAds };
};

export default useMyAds;
