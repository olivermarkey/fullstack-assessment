import { Button } from "@mantine/core";
import { NavLink } from "react-router";
import { NavLink as NavLinkButton } from "@mantine/core";

type NavLinkButtonProps = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; stroke?: number }>;
};

export default function NavLinkComponent({
  to,
  label,
  Icon,
}: NavLinkButtonProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <NavLinkButton
          href="#required-for-focus"
          label={label}
          leftSection={<Icon size={16} stroke={1.5} />}
          active={isActive}
          styles={{
            root: {
              borderRadius: 'var(--mantine-radius-md)'
            }
          }}
        />
      )}
    </NavLink>
  );
}
