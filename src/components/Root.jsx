import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './shared/Header';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { string } from 'prop-types';
import { UserDashboardBar } from './shared/UserDashboardBar';

export const Root = ({ dashboard }) => {
  return (
    <>
      <HelmetProvider>
        <Header></Header>
        {dashboard === 'user' && <UserDashboardBar></UserDashboardBar>}
        <Outlet></Outlet>
      </HelmetProvider>

      <Toaster position="bottom-center" reverseOrder={false} />
      {!location.pathname.includes('/dashboard') && <ScrollRestoration />}
    </>
  );
};

Root.propTypes = {
  dashboard: string,
};
