import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_PAGE } from '../routes/paths';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const role = 'Administrator';
  // const role = 'Customer';

  return role;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();

  if (!accessibleRoles.includes(currentRole)) {
    return <Navigate to={PATH_PAGE.page403} />;
  }

  return <>{children}</>;
}
