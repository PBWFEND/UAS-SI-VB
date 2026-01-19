import ForbiddenPage from '../pages/ForbiddenPage';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    return <ForbiddenPage />;
  }

  return children;
};

export default RoleGuard;
