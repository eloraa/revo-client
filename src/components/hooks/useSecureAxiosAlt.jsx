import { getStoredValue } from '../utils/localstorage';
import axios from 'axios';

const instance = axios.create({ baseURL: import.meta.env.VITE_BACKENDSERVER });

export const useSecureAxiosAlt = () => {
  instance.interceptors.request.use(
    function (config) {
      const token = getStoredValue('token');
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    async error => {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        return Promise.reject('signout');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
