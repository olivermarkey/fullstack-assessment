import { Outlet } from "react-router";
import { AppShell, Burger, Flex, Group, Box, Breadcrumbs, Anchor } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
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
    to: "/material/search",
    label: "Search",
    icon: IconSearch,
  },
  {
    to: "/material/create",
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
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { width: viewportWidth } = useViewportSize();

  const navWidth = desktopOpened ? (viewportWidth >= 1200 ? 400 : 300) : 80;

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: desktopOpened ? 300 : 80, lg: desktopOpened ? 400 : 80 },
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: false },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Flex h="100%" style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: `${navWidth}px`,
                borderRight: '1px solid var(--mantine-color-gray-3)',
                transition: 'width 200ms ease',
                zIndex: 1,
              }}
            />
            
            {/* Left section with logo and burger */}
            <Flex 
              align="center" 
              justify="center"
              h="100%" 
              style={{
                width: `${navWidth}px`,
                transition: 'width 200ms ease',
                position: 'relative',
                zIndex: 2,
                padding: desktopOpened ? '0 var(--mantine-spacing-md)' : 0,
              }}
            >
              <Group align="center" justify={desktopOpened ? "flex-start" : "center"} w="100%">
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                />
                {desktopOpened && (
                  <Box visibleFrom="sm">
                    <div>FullStack</div>
                  </Box>
                )}
              </Group>
            </Flex>

            {/* Right section with breadcrumbs and logout */}
            <Flex 
              justify="space-between" 
              align="center" 
              h="100%"
              px="md"
              style={{
                flex: 1,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Breadcrumbs>
                <Anchor href="/">Home</Anchor>
                <Anchor href="#">Breadcrumb 2</Anchor>
                <Anchor href="#">Breadcrumb 3</Anchor>
              </Breadcrumbs>
              <LogoutButton />
            </Flex>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          {navLinks.map((link) => (
            <NavLinkComponent
              key={link.to}
              to={link.to}
              label={link.label}
              Icon={link.icon}
              collapsed={!desktopOpened}
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
