import { Outlet, useNavigate, useLocation } from "react-router";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Box,
  Breadcrumbs,
  Anchor,
  Stack,
} from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import NavLinkComponent from "~/components/common/nav-link-component";
import { AppBreadcrumbs } from "~/components/common/breadcrumbs";
import { NavUser } from "~/components/common/nav-user";
import {
  IconHome,
  IconPlus,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import ProtectedRoute from "~/components/auth/protected-route";
import { useEffect } from "react";

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
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { width: viewportWidth } = useViewportSize();
  const location = useLocation();

  const navWidth = desktopOpened ? (viewportWidth >= 1200 ? 400 : 300) : 80;

  // Close mobile navbar on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: {
            base: 200,
            md: desktopOpened ? 300 : 80,
            lg: desktopOpened ? 400 : 80,
          },
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: false },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Flex h="100%" style={{ position: "relative" }}>
            <Box
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: `${navWidth}px`,
                borderRight: "1px solid var(--mantine-color-gray-3)",
                transition: "width 200ms ease",
                zIndex: 1,
              }}
              visibleFrom="sm"
            />

            {/* Left section with logo and burger */}
            <Flex
              align="center"
              justify="center"
              h="100%"
              style={{
                width: `${navWidth}px`,
                transition: "width 200ms ease",
                position: "relative",
                zIndex: 2,
                padding: desktopOpened ? "0 var(--mantine-spacing-md)" : 0,
              }}
            >
              <Group
                align="center"
                justify={desktopOpened ? "flex-start" : "center"}
                w="100%"
              >
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
                position: "relative",
                zIndex: 2,
              }}
            >
              <Box visibleFrom="sm">
                <AppBreadcrumbs />
              </Box>
              <Box hiddenFrom="sm">
                <NavUser collapsed />
              </Box>
            </Flex>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Stack justify="space-between" h="100%">
            <Stack gap={desktopOpened ? "2px" : "md"}>
              {navLinks.map((link) => (
                <NavLinkComponent
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  Icon={link.icon}
                  collapsed={!desktopOpened}
                />
              ))}
            </Stack>
            <Box style={{ 
              borderTop: '1px solid var(--mantine-color-gray-3)',
              margin: '0 -16px',
              padding: '16px 16px 0'
            }}>
              <NavUser collapsed={!desktopOpened} />
            </Box>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main bg="gray.0">
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  );
}
