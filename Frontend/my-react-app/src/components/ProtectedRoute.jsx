import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized for specific route
    return <Navigate to={user.role === 'admin' ? '/admin/courses' : '/instructor/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
