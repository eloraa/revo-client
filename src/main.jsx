import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Root } from './components/Root';
import AuthProvider from './components/providers/AuthProvider';
import { Home } from './components/pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Error } from './components/shared/Error';
import { Signin } from './components/pages/Signin';
import { Signup } from './components/pages/Signup';
import { Profile } from './components/pages/userDashboard/Profile';
import { PrivateRoute } from './components/utils/PrivateRoute';
import { AddProduct } from './components/pages/userDashboard/AddProduct';
import { MyProducts } from './components/pages/userDashboard/MyProducts';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dashboard } from './components/pages/Dashboard';
import { AdminRoute } from './components/utils/AdminRoute';
import { ManageUsers } from './components/pages/adminDashboard/ManageUsers';
import { ProductQueue } from './components/pages/moderatorDashboard/ProductQueue';
import { ModeratorRoute } from './components/utils/ModeratorRoute';
import { UpdateProduct } from './components/pages/userDashboard/updateProduct';
import { ManageCoupons } from './components/pages/adminDashboard/ManageCoupons';
import { Products } from './components/pages/Products';
import { ProductDetails } from './components/pages/ProductDetails';
import { ReportedProduct } from './components/pages/moderatorDashboard/ReportedProduct';
import { Statistic } from './components/pages/adminDashboard/Statistic';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPEAPIKEY);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error></Error>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: '/signin',
        element: <Signin></Signin>,
      },
      {
        path: '/signup',
        element: <Signup></Signup>,
      },
      {
        path: '/products',
        element: <Products></Products>,
      },
      {
        path: '/product/:id',
        element: (
          <PrivateRoute>
            <ProductDetails></ProductDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Root dashboard="user"></Root>
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard></Dashboard>,
      },
      {
        path: 'profile',
        element: <Profile></Profile>,
      },
      {
        path: 'add-product',
        element: <AddProduct></AddProduct>,
      },
      {
        path: 'my-products',
        element: <MyProducts></MyProducts>,
      },
      {
        path: 'manage-users',
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: 'manage-coupons',
        element: (
          <AdminRoute>
            <ManageCoupons></ManageCoupons>
          </AdminRoute>
        ),
      },
      {
        path: 'statistics',
        element: (
          <AdminRoute>
            <Statistic></Statistic>
          </AdminRoute>
        ),
      },
      {
        path: 'queue',
        element: (
          <ModeratorRoute>
            <ProductQueue></ProductQueue>
          </ModeratorRoute>
        ),
      },
      {
        path: 'reported',
        element: (
          <ModeratorRoute>
            <ReportedProduct></ReportedProduct>
          </ModeratorRoute>
        ),
      },
      {
        path: 'update-product/:id',
        element: <UpdateProduct></UpdateProduct>,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router}></RouterProvider>
        </Elements>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
