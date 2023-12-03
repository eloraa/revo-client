import { useQuery } from '@tanstack/react-query';
import { useSecureAxios } from './useSecureAxios';
import { useAuth } from './useAuth';
import { useNormalAxios } from './useNormalAxios';

export const useProduct = (id, secure) => {
  const secureAxios = useSecureAxios();
  const normalAxios = useNormalAxios();
  let instance,
    useData = {};

  if (secure) instance = secureAxios;
  else instance = normalAxios;

  const { user } = useAuth();

  if (secure && user) {
    useData = {
      email: user?.email,
      uid: user?.uid,
    };
  }

  const {
    data: product = null,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        let params = {};

        if (secure && user) {
          params = {
            ...useData,
          };
          params.hasToken = true;
        }

        const res = await instance.get('/product/get/' + id, {
          params,
        });

        return res.data || {};
      } catch (err) {
        console.log(err);
        throw err
      }
    },
  });

  return { product, isLoading, isRefetching, isError, refetch };
};
