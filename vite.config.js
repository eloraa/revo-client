/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
    VITE_APIKEY: process.env.VITE_APIKEY,
    VITE_AUTHDOMAIN: process.env.VITE_AUTHDOMAIN,
    VITE_PROJECTID: process.env.VITE_PROJECTID,
    VITE_STORAGEBUCKET: process.env.VITE_STORAGEBUCKET,
    VITE_MESSAGINGSENDERID: process.env.VITE_MESSAGINGSENDERID,
    VITE_APPID: process.env.VITE_APPID,
    VITE_BACKENDSERVER: process.env.VITE_BACKENDSERVER,
  },
});
