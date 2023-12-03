import { useQuery } from '@tanstack/react-query';
import { useSecureAxios } from './useSecureAxios';
import { useAuth } from './useAuth';

export const useStatistics = () => {
  const secureAxios = useSecureAxios();
  const { user } = useAuth();

  const {
    data: statistics = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      try {
        const res = await secureAxios.get('/statistics', {
          params: {
            email: user?.email,
            uid: user?.uid,
          },
        });
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });

  return { statistics, isRefetching, isLoading, isError, refetch };
};
