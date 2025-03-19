import { useAuthContext } from "~/components/auth/auth-provider";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { serialize } from "cookie";

export default function Logout() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear localStorage
        logout();

        // Clear the session cookie
        document.cookie = serialize('session_id', '', {
          path: '/',
          maxAge: 0,
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        });

        // Add a small delay to ensure cookie is cleared
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify cookie is cleared
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session_id='));
        
        if (!sessionCookie) {
          setIsLoggingOut(false);
          navigate("/login", { replace: true });
        } else {
          console.error('Failed to clear session cookie');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // Still try to navigate even if there's an error
        navigate("/login", { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div>
      {isLoggingOut ? "Logging out..." : "Redirecting to login..."}
    </div>
  );
}
