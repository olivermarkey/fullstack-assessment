import { Group, Text, Box } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface FormErrorProps {
  error?: unknown;
  fetcher?: { data?: { error?: unknown } | null };
}

export function FormError({ error, fetcher }: FormErrorProps) {
  // Helper function to safely get error message
  const getErrorMessage = () => {
    // First check direct error prop
    if (error) {
      return typeof error === 'string' ? error : 'An error occurred';
    }
    
    // Then check fetcher data
    if (fetcher?.data?.error) {
      return typeof fetcher.data.error === 'string' 
        ? fetcher.data.error 
        : 'An error occurred';
    }

    return null;
  };

  const errorMessage = getErrorMessage();
  if (!errorMessage) return null;

  return (
    <Box bg="var(--mantine-color-red-0)" p="xs" style={{ borderRadius: 'var(--mantine-radius-sm)' }}>
      <Group gap="xs">
        <IconAlertCircle size={16} color="var(--mantine-color-red-6)" />
        <Text size="sm" c="red.7">
          {errorMessage}
        </Text>
      </Group>
    </Box>
  );
}
