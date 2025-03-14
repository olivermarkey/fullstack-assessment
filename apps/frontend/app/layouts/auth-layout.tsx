import { Center } from "@mantine/core";
import { Outlet } from "react-router";
import { AuthRoute } from "~/components/auth/auth-route";

export default function AuthLayout() {
  return (
    <AuthRoute>
      <Center h="100vh">
        <Outlet />
      </Center>
    </AuthRoute>
  );
}
