import { Suspense, lazy } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import DashboardLayout from '../layouts/dashboard';
import MainLayout from '../layouts/main';
// guards
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';

import RoleBasedGuard from '../guards/RoleBasedGuard';

// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const { user } = useAuth();

  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <Verify /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={user?.roles}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'product',
          children: [
            { element: <Navigate to="/dashboard/product/list" replace />, index: true },
            { path: 'shop', element: <Shop /> },
            { path: ':name', element: <ProductDetails /> },
            { path: 'list', element: <ProductList /> },
            { path: 'new', element: <ProductCreate /> },
            { path: ':name/edit', element: <ProductCreate /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'category', element: <Category /> },
            { path: 'platform', element: <Platform /> },
            { path: 'cdkey/:productId', element: <Cdkey /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':userId/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '403', element: <NoPermission /> },

        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        {
          path: 'account',
          element: (
            <AuthGuard>
              <UserAccount />
            </AuthGuard>
          ),
        },
        {
          path: 'product',
          children: [
            { element: <Navigate to="/product/shop" replace />, index: true },
            { path: 'shop', element: <Shop /> },
            { path: ':name', element: <ProductDetails /> },
            {
              path: 'checkout',
              element: (
                <AuthGuard>
                  <Checkout />
                </AuthGuard>
              ),
            },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPassword')));
const Verify = Loadable(lazy(() => import('../pages/auth/Verify')));

// PRODUCT
const Shop = Loadable(lazy(() => import('../pages/customer/product/Shop')));
const ProductDetails = Loadable(lazy(() => import('../pages/customer/product/ProductDetails')));
const ProductList = Loadable(lazy(() => import('../pages/dashboard/product/ProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/dashboard/product/ProductCreate')));
const Checkout = Loadable(lazy(() => import('../pages/customer/product/Checkout')));
const Category = Loadable(lazy(() => import('../pages/dashboard/product/CategoryList')));
const Platform = Loadable(lazy(() => import('../pages/dashboard/product/PlatformList')));
const Cdkey = Loadable(lazy(() => import('../pages/dashboard/product/CdkeyList')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceDetails')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/user/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/customer/user/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/user/UserCreate')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const Page500 = Loadable(lazy(() => import('../pages/error/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/error/Page404')));
const NoPermission = Loadable(lazy(() => import('../pages/error/Page403')));
