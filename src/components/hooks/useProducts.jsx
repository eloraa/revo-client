import { useQuery } from '@tanstack/react-query';
import { useSecureAxios } from './useSecureAxios';
import { useAuth } from './useAuth';
import { useNormalAxios } from './useNormalAxios';
import { useState } from 'react';

export const useProducts = (secure, options) => {
  const secureAxios = useSecureAxios();
  const normalAxios = useNormalAxios();
  const [fields, setFields] = useState(options ? options : []);
  const [sort, setSort] = useState(null);
  const [direction, setDirection] = useState('asc');
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
    data: products = [],
    isLoading,
    isError,
    isRefetching,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['product', ...fields],
    queryFn: async () => {
      try {
        const params = {
          ...useData,
        };
        if (fields && fields.length > 0) {
          fields.forEach(field => {
            params[Object.keys(field)[0]] = field[Object.keys(field)[0]];
          });
        }
        params.sort = sort;
        params.sortDirection = direction;

        const res = await instance.get('/product', {
          params,
        });

        return res.data;
      } catch (err) {
        console.log(err);
        throw err
      }
    },
  });

  return { products, isLoading, isRefetching, isPending, isError, refetch, setFields, setSort, setDirection, fields, sort, direction };
};
