import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <></>;
  }

  if (user) {
    return children;
  }

  return <Navigate state={location.pathname} to="../signin"></Navigate>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};
