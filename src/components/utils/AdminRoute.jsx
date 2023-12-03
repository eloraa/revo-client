import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }) => {
  const { user, loading, userclaims } = useAuth();
  const location = useLocation();

  if (loading) {
    return <></>;
  }

  if (user && userclaims?.claims?.admin) {
    return children;
  }

  return <Navigate state={location.pathname} to="../../"></Navigate>;
};

AdminRoute.propTypes = {
  children: PropTypes.node,
};
