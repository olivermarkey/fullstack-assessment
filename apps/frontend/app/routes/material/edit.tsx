import { z } from "zod";
import {
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { FormError } from "~/components/common/form-error";
import {
  classSchema,
  createMaterialSchema,
  materialSchema,
  nounSchema,
} from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import type { Route } from "./+types/edit";
import React from "react";
import { getAccessTokenFromCookie } from "~/lib/get-cookie";

// Update the loader response schema
const loaderSchema = z.object({
  material: materialSchema,
  nouns: z.array(nounSchema),
  classes: z.array(classSchema),
});

export async function loader({ params, request }: Route.LoaderArgs) {
  const accessToken = getAccessTokenFromCookie(request);

  const [material, nouns, classes] = await Promise.all([
    ApiClient.get(`/materials/${params.id}`, {
      schema: materialSchema,
      accessToken,
    }),
    ApiClient.get("/nouns", {
      schema: z.array(nounSchema),
      accessToken,
    }),
    ApiClient.get("/classes", {
      schema: z.array(classSchema),
      accessToken,
    }),
  ]);

  // Filter for active items, but always include the material's current noun and class
  const filteredNouns = nouns.filter(
    (noun) => noun.active || noun.id === material.noun_id
  );
  const filteredClasses = classes.filter(
    (cls) => cls.active || cls.id === material.class_id
  );

  return loaderSchema.parse({
    material,
    nouns: filteredNouns,
    classes: filteredClasses,
  });
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const accessToken = getAccessTokenFromCookie(request);

  const data = {
    material_number: Number(formData.get("material_number")),
    description: String(formData.get("description")),
    long_text: formData.get("long_text")
      ? String(formData.get("long_text"))
      : null,
    details: formData.get("details") ? String(formData.get("details")) : null,
    noun_id: String(formData.get("noun_id")),
    class_id: String(formData.get("class_id")),
  };

  try {
    const response = await ApiClient.patch(`/materials/${params.id}`, data, {
      schema: materialSchema,
      accessToken,
    });

    if (response) {
      return { success: true, material: response };
    }
    return { success: false, error: "Failed to update material" };
  } catch (error) {
    console.log("[Edit Material Action] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export default function EditMaterial() {
  const { material, nouns, classes } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const formSchema = createMaterialSchema.extend({
    material_number: z.number().min(1, {
      message: "Material number is required and must be greater than 0",
    }),
    description: z.string().min(1, { message: "Description is required" }),
    noun_id: z.string().min(1, { message: "Noun selection is required" }),
    class_id: z.string().min(1, { message: "Class selection is required" }),
  });

  const form = useForm({
    validate: zodResolver(formSchema),
    mode: "controlled",
    initialValues: {
      material_number: material.material_number,
      description: material.description,
      long_text: material.long_text || "",
      details: material.details || "",
      noun_id: material.noun_id,
      class_id: material.class_id,
    },
  });

  // Transform the data for Select components
  const nounOptions = nouns.map((noun) => ({
    value: noun.id,
    label: noun.name,
  }));

  // Filter classes based on selected noun
  const filteredClassOptions = classes
    .filter((cls) => cls.noun_id === form.values.noun_id)
    .map((cls) => ({
      value: cls.id,
      label: cls.name,
    }));

  // Handle noun selection change
  const handleNounChange = (value: string | null) => {
    form.setFieldValue("noun_id", value || "");
    form.setFieldValue("class_id", "");
  };

  const onSubmit = (values: typeof form.values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
      }
    });

    fetcher.submit(formData, {
      method: "patch",
    });
  };

  // Navigate to search page on successful submission
  React.useEffect(() => {
    if (fetcher.data?.success) {
      navigate("/material/search");
    }
  }, [fetcher.data, navigate]);

  return (
    <Center>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Card
          shadow="sm"
          radius="md"
          withBorder
          w={{ base: 400, sm: 500, md: 600 }}
        >
          <Card.Section p="lg">
            <Stack>
              <Text size="xl">Edit Material</Text>
              <FormError fetcher={fetcher} />

              <NumberInput
                label="Material Number"
                placeholder="Enter material number"
                withAsterisk
                {...form.getInputProps("material_number")}
              />

              <TextInput
                label="Description"
                placeholder="Enter description"
                withAsterisk
                {...form.getInputProps("description")}
              />

              <Textarea
                label="Long Text"
                placeholder="Enter long text description"
                minRows={3}
                {...form.getInputProps("long_text")}
                required={false}
              />

              <Textarea
                label="Details"
                placeholder="Enter additional details"
                minRows={3}
                {...form.getInputProps("details")}
                required={false}
              />

              <Select
                label="Noun"
                placeholder="Select a noun"
                data={nounOptions}
                withAsterisk
                searchable
                {...form.getInputProps("noun_id")}
                onChange={handleNounChange}
              />

              <Select
                label="Class"
                placeholder={
                  form.values.noun_id
                    ? "Select a class"
                    : "Please select a noun first"
                }
                data={filteredClassOptions}
                withAsterisk
                searchable
                disabled={!form.values.noun_id}
                {...form.getInputProps("class_id")}
                onChange={(value) =>
                  form.setFieldValue("class_id", value || "")
                }
              />

              <Button type="submit" loading={fetcher.state === "submitting"}>
                Update Material
              </Button>
            </Stack>
          </Card.Section>
        </Card>
      </form>
    </Center>
  );
}
