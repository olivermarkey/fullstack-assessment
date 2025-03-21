import {
  Flex,
  Modal,
  Button,
  Card,
  Text,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { MaterialsTable } from "~/components/search/materials-table";
import {
  type MaterialWithDetails,
  materialWithDetailsSchema,
} from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import { z } from "zod";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getAccessTokenFromCookie } from "~/lib/get-cookie";
import { IconColumns } from "@tabler/icons-react";
import { SearchInput } from "~/components/search/search-input";
import { searchParamsCache } from "~/lib/search-params";
import type { Route } from "./+types/search";
const searchResponseSchema = z.object({
  materials: z.array(materialWithDetailsSchema),
  corrected: z.string().optional(),
});

export async function loader({ request }: Route.LoaderArgs) {
  const accessToken = getAccessTokenFromCookie(request);
  const url = new URL(request.url);

  // Use the search params cache to get the search query
  const { q: searchQuery } = searchParamsCache.parse(
    Object.fromEntries(url.searchParams.entries())
  );

  if (searchQuery?.trim()) {
    try {
      const response = await ApiClient.get(
        `/materials/search?q=${encodeURIComponent(searchQuery)}`,
        {
          schema: searchResponseSchema,
          accessToken,
        }
      );
      return { ...response, isSearching: false };
    } catch (error) {
      console.error("[Search Loader] Search error:", error);
      return { materials: [], corrected: undefined, isSearching: false };
    }
  }

  // If no search query, return all materials
  const response = await ApiClient.get("/materials", {
    schema: z.object({
      materials: z.array(materialWithDetailsSchema),
    }),
    accessToken,
  });
  return { ...response, isSearching: false };
}

export async function action({ request }: { request: Request }) {
  const accessToken = getAccessTokenFromCookie(request);

  // Delete material
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const id = formData.get("id");
    await ApiClient.deleteNoContent(`/materials/${id}`, { accessToken });
    return { success: true };
  }

  return { success: false };
}

export default function Search() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialWithDetails | null>(null);
  const fetcher = useFetcher();

  const materials = loaderData.materials;

  const handleEdit = (material: MaterialWithDetails) => {
    navigate(`/material/edit/${material.id}`);
  };

  const handleDelete = (material: MaterialWithDetails) => {
    setSelectedMaterial(material);
    open();
  };

  const confirmDelete = async () => {
    if (!selectedMaterial) return;

    const formData = new FormData();
    formData.append("id", selectedMaterial.id);

    fetcher.submit(formData, {
      method: "DELETE",
      action: "/material/search",
    });

    close();
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <Flex direction="column" gap="md">
      <Card p={0} radius="sm" withBorder>
        <Flex direction="column">
          <Flex justify="space-between" align="center" p="md">
            <Text size="lg" fw={500}>
              Materials
            </Text>

            <Flex gap="md" align="center">
              <Menu>
                <Menu.Target>
                  <Button
                    variant="default"
                    leftSection={<IconColumns size={16} />}
                  >
                    Columns
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Material Number</Menu.Item>
                  <Menu.Item>Long Text</Menu.Item>
                  <Menu.Item>Description</Menu.Item>
                  <Menu.Item>Tags</Menu.Item>
                  <Menu.Item>Action</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Flex>
          <Flex direction="column" gap="xs" px="md" mb="lg">
            <SearchInput />
          </Flex>

          <MaterialsTable
            materials={materials}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Flex>
      </Card>

      <Modal opened={opened} onClose={close} title="Delete Material">
        <Flex direction="column" gap="md">
          <div>Are you sure you want to delete this material?</div>
          <Flex gap="md" justify="flex-end">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={fetcher.state === "submitting"}
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}
