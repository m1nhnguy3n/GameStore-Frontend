// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  cart: getIcon('ic_cart'),
  user: getIcon('ic_user'),
  invoice: getIcon('ic_invoice'),
};

const navConfig = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.new },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // PRODUCT
      {
        title: 'Product',
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.product.shop },
          { title: 'list', path: PATH_DASHBOARD.product.list },
          { title: 'create', path: PATH_DASHBOARD.product.new },
          { title: 'checkout', path: PATH_DASHBOARD.product.checkout },
          { title: 'category', path: PATH_DASHBOARD.product.category },
          { title: 'platform', path: PATH_DASHBOARD.product.platform },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
        ],
      },
    ],
  },
];

export default navConfig;
