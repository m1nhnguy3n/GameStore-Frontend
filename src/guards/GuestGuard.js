import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user?.roles.includes('Customer')) {
    return <Navigate to={PATH_PAGE.product.shop} />;
  } 

  if (isAuthenticated && user?.roles.includes('Administrator')) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  } 

  

  return <>{children}</>;
}
