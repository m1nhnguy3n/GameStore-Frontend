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
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
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
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'product',
          children: [
            { element: <Navigate to="/dashboard/product/shop" replace />, index: true },
            { path: 'shop', element: <Shop /> },
            { path: ':name', element: <ProductDetails /> },
            { path: 'list', element: <ProductList /> },
            { path: 'new', element: <ProductCreate /> },
            { path: ':name/edit', element: <ProductCreate /> },
            { path: 'checkout', element: <Checkout /> },
            { path: 'category', element: <Category /> },
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
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'payment', element: <Payment /> },
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
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        // { path: 'shop', element: <Shop /> },
        // { path: 'checkout', element: <Checkout /> },
        // { path: ':name', element: <ProductDetails /> },
        { path: 'account', element: <UserAccount /> },
        {
          path: 'product',
          children: [
            { element: <Navigate to="/product/shop" replace />, index: true },
            { path: 'shop', element: <Shop /> },
            { path: ':name', element: <ProductDetails /> },
            { path: 'checkout', element: <Checkout /> },
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

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// PRODUCT
const Shop = Loadable(lazy(() => import('../pages/dashboard/Shop')));
const ProductDetails = Loadable(lazy(() => import('../pages/dashboard/ProductDetails')));
const ProductList = Loadable(lazy(() => import('../pages/dashboard/product/ProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/dashboard/product/ProductCreate')));
const Checkout = Loadable(lazy(() => import('../pages/dashboard/product/Checkout')));
const Category = Loadable(lazy(() => import('../pages/dashboard/product/CategoryList')));


// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/invoice/InvoiceEdit')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/user/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/user/UserCreate')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/other/About')));
const Contact = Loadable(lazy(() => import('../pages/other/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/other/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/other/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/other/Maintenance')));
const Payment = Loadable(lazy(() => import('../pages/other/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/error/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/error/Page404')));
const NoPermission = Loadable(lazy(() => import('../pages/error/Page403')));
