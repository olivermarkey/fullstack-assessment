import { TextInput, ActionIcon, Flex } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTransition, useState, useEffect } from "react";
import { useQueryState } from 'nuqs';
import { searchParsers } from "~/lib/search-params";
import { useDebounce } from 'use-debounce';

export function SearchInput() {
  const [isPending, startTransition] = useTransition();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useQueryState(
    'q',
    searchParsers.q.withOptions({
      startTransition,
      shallow: false
    })
  );

  // Debounce the search term updates
  const [debouncedSearchTerm] = useDebounce(localSearchTerm, 300);

  // Update the URL query parameter when the debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };

  return (
    <div style={{ position: 'relative', maxWidth: '400px' }}>
      <Flex gap="xs" align="center">
        <TextInput
          placeholder="Search materials..."
          leftSection={<IconSearch size={16} />}
          rightSection={
            localSearchTerm && (
              <ActionIcon size="sm" variant="subtle" onClick={handleClear}>
                <IconX size={16} />
              </ActionIcon>
            )
          }
          value={localSearchTerm}
          onChange={(event) => setLocalSearchTerm(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
      </Flex>
    </div>
  );
}
