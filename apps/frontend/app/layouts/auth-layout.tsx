import { Center } from "@mantine/core";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Center h="100vh">
      <Outlet />
    </Center>
  );
}