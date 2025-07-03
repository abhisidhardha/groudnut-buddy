// src/Components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate,useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
