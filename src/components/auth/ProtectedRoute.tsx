import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Remova toda a lógica de autenticação e simplesmente retorne os children
  return <>{children}</>;
};

export default ProtectedRoute;