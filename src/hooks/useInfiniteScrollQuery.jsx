import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import QUERY from '../constants/query';
import Axios from '../api/axios';

export const useInfiniteScrollQuery = (queryKey, baseUrl, path, keyWord) => {
  const axios = new Axios(baseUrl);
  const { ref, inView } = useInView();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    hasNextPage,
  } = useInfiniteQuery(
    queryKey,
    async ({ pageParam = 1 }) => await axios.get(path(pageParam, keyWord)),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.data.result.length ? nextPage : undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: QUERY.STALETIME.FIVE_MIN,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return {
    ref,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    data,
  };
};
