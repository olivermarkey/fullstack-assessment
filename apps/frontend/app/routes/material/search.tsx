import { Flex, Modal, Button } from "@mantine/core";
import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { MaterialsTable } from "~/components/search/materials-table";
import { type MaterialWithDetails, materialWithDetailsSchema } from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import { z } from "zod";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getAccessTokenFromCookie } from "~/lib/get-cookie";



export async function loader({ request }: { request: Request }) {
  console.log('[Search] Request headers:', Object.fromEntries(request.headers.entries()));
  
  const accessToken = getAccessTokenFromCookie(request);
  const response = await ApiClient.get("/materials", {
    schema: z.object({
      materials: z.array(materialWithDetailsSchema)
    }),
    accessToken
  });
  return response;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id");
  const accessToken = getAccessTokenFromCookie(request);

  if (request.method === "DELETE") {
    await ApiClient.deleteNoContent(`/materials/${id}`, { accessToken });
    return { success: true };
  }

  return { success: false };
}

export default function Search() {
  const { materials } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialWithDetails | null>(null);
  const fetcher = useFetcher();

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
      action: "/material/search"
    });
    
    close();
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <Flex direction="column" gap="md">
      <MaterialsTable 
        materials={materials} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal opened={opened} onClose={close} title="Delete Material">
        <Flex direction="column" gap="md">
          <div>Are you sure you want to delete this material?</div>
          <Flex gap="md" justify="flex-end">
            <Button variant="outline" onClick={close}>Cancel</Button>
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
