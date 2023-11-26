// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
  page403: '/403',
  account: '/account',
  product: {
    root: '/product',
    shop: '/product/shop',
    checkout: '/product/checkout',
    view: (name) => `/product/${name}`,
  },
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    shop: path(ROOTS_DASHBOARD, '/product/shop'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    checkout: path(ROOTS_DASHBOARD, '/product/checkout'),
    new: path(ROOTS_DASHBOARD, '/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/product/${name}/edit`),
    category: path(ROOTS_DASHBOARD, '/product/category'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
  },
};
