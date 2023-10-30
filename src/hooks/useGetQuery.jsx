import { useQuery } from '@tanstack/react-query';
import QUERY from '../constants/query';
import Axios from '../utils/api/axios';

export default function useGetQuery(
  queryKey,
  baseUrl,
  path,
  enableValue,
  staleTime,
  successFn
) {
  const axios = new Axios(baseUrl);
  const { isLoading, isError, refetch, data } = useQuery(
    queryKey,
    () => axios.get(path),
    {
      onSuccess: successFn,
      staleTime: staleTime === 0 ? 0 : QUERY.STALETIME.FIVE_MIN,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!enableValue,
    }
  );

  return { isLoading, isError, refetch, data };
}
