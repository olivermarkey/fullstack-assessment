import { Button } from "@mantine/core";
import { useAuthContext } from "../auth/auth-provider";


export function LogoutButton() {
  const { logout } = useAuthContext();
  return <Button onClick={logout}>Logout</Button>;
}