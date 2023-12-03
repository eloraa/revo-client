import { useQuery } from '@tanstack/react-query';
import { useSecureAxios } from './useSecureAxios';
import { useAuth } from './useAuth';

export const useUserProduct = () => {
  const secureAxios = useSecureAxios();
  const { user } = useAuth();

  const {
    data: products = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', user?.uid],
    queryFn: async () => {
      try {
        const res = await secureAxios.get('/product/get', {
          params: {
            email: user?.email,
            uid: user?.uid,
          },
        });
        return res.data;
      } catch (err) {
        console.log(err);
        throw err
      }
    },
  });

  return { products, isRefetching, isError, isLoading, refetch };
};
