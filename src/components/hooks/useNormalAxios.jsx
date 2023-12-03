import axios from 'axios';

const instance = axios.create({ baseURL: import.meta.env.VITE_BACKENDSERVER });
export const useNormalAxios = () => {
  return instance;
};
