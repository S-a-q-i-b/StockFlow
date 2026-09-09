import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};

export default ProtectedRoute;
