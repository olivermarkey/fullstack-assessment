import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, signinRedirect } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      signinRedirect();
    }
  }, [user, signinRedirect]);

  return children;
}
