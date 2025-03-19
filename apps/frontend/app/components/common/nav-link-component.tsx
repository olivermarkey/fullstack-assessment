import { Tooltip } from "@mantine/core";
import { NavLink } from "react-router";
import { NavLink as NavLinkButton } from "@mantine/core";

type NavLinkButtonProps = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; stroke?: number }>;
  collapsed?: boolean;
};

export default function NavLinkComponent({
  to,
  label,
  Icon,
  collapsed = false,
}: NavLinkButtonProps) {
  const button = (
    <NavLink to={to} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
      {({ isActive }) => (
        <NavLinkButton
          href="#required-for-focus"
          label={!collapsed ? label : undefined}
          leftSection={<Icon size={20} stroke={1.5} />}
          active={isActive}
          styles={{
            root: {
              borderRadius: 'var(--mantine-radius-md)',
              width: collapsed ? '48px' : '100%',
              padding: collapsed ? '12px' : '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '2px 0'
            },
            section: {
              marginRight: collapsed ? 0 : undefined
            },
            label: {
              flex: 1
            }
          }}
        />
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip label={label} position="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}
