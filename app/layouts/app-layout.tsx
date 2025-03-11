import { Outlet } from "react-router";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavLinkComponent from "~/components/common/nav-link-component";
import { IconHome, IconPlus, IconSearch } from "@tabler/icons-react";

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
];

export default function ProjectLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div>FullStack</div>
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
  );
}
