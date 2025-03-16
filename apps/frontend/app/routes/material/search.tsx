import { Flex, Modal, Button } from "@mantine/core";
import { useLoaderData, useNavigate } from "react-router";
import { MaterialsTable } from "~/components/search/materials-table";
import { type MaterialWithDetails, materialWithDetailsSchema } from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import { z } from "zod";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export async function loader() {
  const response = await ApiClient.get("/materials", {
    schema: z.object({
      materials: z.array(materialWithDetailsSchema)
    })
  });
  return response;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (request.method === "DELETE") {
    await ApiClient.delete(`/materials/${id}`);
    return { success: true };
  }

  return { success: false };
}

export default function Search() {
  const { materials } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialWithDetails | null>(null);

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
    
    await fetch("/search", {
      method: "DELETE",
      body: formData
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
            <Button color="red" onClick={confirmDelete}>Delete</Button>
          </Flex>
        </Flex>
      </Modal>
    </Flex>
  );
}
