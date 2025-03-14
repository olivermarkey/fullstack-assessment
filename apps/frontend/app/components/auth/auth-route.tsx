import { Navigate } from "react-router";
import { useAuthContext } from "./auth-provider";

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
