import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem("rank");
  return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
};

export default ProtectedRoute;