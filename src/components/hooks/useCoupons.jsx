import { useQuery } from '@tanstack/react-query';
import { useNormalAxios } from './useNormalAxios';

export const useCoupons = () => {
  const normalAxios = useNormalAxios();

  const {
    data: coupons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      try {
        const res = await normalAxios.get('/coupons');
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
  });

  return { coupons, isLoading, refetch };
};
