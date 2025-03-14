import { Navigate } from "react-router";
import { useAuthContext } from "./auth-provider";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
