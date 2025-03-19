import { Avatar, Box, Flex, Text, Menu } from "@mantine/core";
import { IconUserCircle, IconLogout } from "@tabler/icons-react";
import { useAuthContext } from "~/components/auth/auth-provider";

interface NavUserProps {
  collapsed?: boolean;
}

export function NavUser({ collapsed = false }: NavUserProps) {
  const { user, logout } = useAuthContext();

  if (!user) return null;

  return (
    <Menu
      shadow="md"
      width={collapsed ? 300 : "target"}
      position={collapsed ? "right-start" : "top"}
      offset={collapsed ? 4 : 0}
      withArrow={collapsed}
    >
      <Menu.Target>
        <Box
          style={{
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "var(--mantine-radius-md)",
            "&:hover": {
              backgroundColor: "var(--mantine-color-gray-1)",
            },
          }}
        >
          <Flex
            align="center"
            gap="sm"
            justify={collapsed ? "center" : "flex-start"}
            w="100%"
          >
            <Avatar size={32} radius="xl" color="blue">
              <IconUserCircle size={20} />
            </Avatar>
            {!collapsed && (
              <Box visibleFrom="lg">
                <Text size="sm" fw={500} lineClamp={1} style={{ flex: 1 }}>
                  {user.email}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {user.email}
          </Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
