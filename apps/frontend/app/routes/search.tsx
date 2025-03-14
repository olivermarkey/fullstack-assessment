import { Flex } from "@mantine/core";
import { useLoaderData } from "react-router";
import { MaterialsTable } from "~/components/search/materials-table";
import { type MaterialWithDetails, materialWithDetailsSchema } from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import { z } from "zod";

export async function loader() {
  const response = await ApiClient.get("/materials", {
    schema: z.object({
      materials: z.array(materialWithDetailsSchema)
    })
  });
  return response;
}

export default function Search() {
  const { materials } = useLoaderData<typeof loader>();
  return (
    <Flex direction="column" gap="md">
      Materials
      <MaterialsTable materials={materials} />
    </Flex>
  );
}
