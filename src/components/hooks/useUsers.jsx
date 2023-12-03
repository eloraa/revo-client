import { useQuery } from '@tanstack/react-query';
import { useSecureAxios } from './useSecureAxios';
import { useAuth } from './useAuth';

export const useUsers = () => {
  const secureAxios = useSecureAxios();
  const { user } = useAuth();

  const {
    data: users = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await secureAxios.get('/auth/users', {
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

  return { users, isRefetching, isLoading, isError, refetch };
};
