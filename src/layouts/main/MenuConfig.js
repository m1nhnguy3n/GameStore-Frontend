// routes
import { PATH_PAGE } from '../../routes/paths';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Shop',
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: PATH_PAGE.product.shop,
  },
];

export default menuConfig;
