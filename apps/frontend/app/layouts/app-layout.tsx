import { Outlet } from "react-router";
import { AppShell, Burger, Flex, Group, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavLinkComponent from "~/components/common/nav-link-component";
import {
  IconHome,
  IconPlus,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import ProtectedRoute from "~/components/auth/protected-route";
import { LogoutButton } from "~/components/common/logout-button";
const navLinks = [
  {
    to: "/",
    label: "Home",
    icon: IconHome,
  },
  {
    to: "/search",
    label: "Search",
    icon: IconSearch,
  },
  {
    to: "/create",
    label: "Create",
    icon: IconPlus,
  },
  {
    to: "/configuration",
    label: "Configuration",
    icon: IconSettings,
  },
];

export default function ProjectLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Flex justify="space-between" align="center" w="100%">
              <SimpleGrid cols={2}>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
              />
              <div>FullStack</div>
              </SimpleGrid>
              <LogoutButton />
            </Flex>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          {navLinks.map((link) => (
            <NavLinkComponent
              key={link.to}
              to={link.to}
              label={link.label}
              Icon={link.icon}
            />
          ))}
        </AppShell.Navbar>
        <AppShell.Main bg="gray.0">
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  );
}
