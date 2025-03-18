import { z } from "zod";
import { Button, Card, Stack, Text, TextInput, Textarea, NumberInput, Select, Center } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { FormError } from "~/components/common/form-error";
import { createMaterialSchema } from "@fullstack-assessment/shared";
import { ApiClient } from "~/lib/api-client";
import type { Route } from "./+types/create-material";
import React from "react";

// Update the loader response schema
const loaderSchema = z.object({
  nouns: z.array(z.object({
    id: z.string(),
    name: z.string(),
    active: z.boolean(),
  })),
  classes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    noun_id: z.string(),
    active: z.boolean(),
  })),
});

export async function loader({ request }: Route.LoaderArgs) {
  const [nouns, classes] = await Promise.all([
    ApiClient.get("/nouns", {
      schema: z.array(z.object({ 
        id: z.string(), 
        name: z.string(),
        active: z.boolean() 
      })),
      request
    }),
    ApiClient.get("/classes", {
      schema: z.array(z.object({ 
        id: z.string(), 
        name: z.string(),
        noun_id: z.string(),
        active: z.boolean()
      })),
      request
    })
  ]);

  return loaderSchema.parse({
    nouns: nouns.filter(noun => noun.active),
    classes: classes.filter(cls => cls.active),
  });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  
  const data = {
    material_number: Number(formData.get("material_number")),
    description: String(formData.get("description")),
    long_text: formData.get("long_text") ? String(formData.get("long_text")) : null,
    details: formData.get("details") ? String(formData.get("details")) : null,
    noun_id: String(formData.get("noun_id")),
    class_id: String(formData.get("class_id")),
  };

  try {
    const response = await ApiClient.post("/materials", data, {
      schema: z.object({
        id: z.string(),
        material_number: z.number(),
        description: z.string(),
        long_text: z.string().nullable(),
        details: z.string().nullable(),
        noun_id: z.string(),
        class_id: z.string(),
      }),
      request
    });

    if (response) {
      return { success: true, material: response };
    }
    return { success: false, error: "Failed to create material" };
  } catch (error) {
    console.log("[Create Material Action] Error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export default function CreateMaterial() {
    const { nouns, classes } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const navigate = useNavigate();
    
    const form = useForm({
        validate: zodResolver(createMaterialSchema),
        initialValues: {
            material_number: 0,
            description: '',
            long_text: '',  // Initialize empty but optional
            details: '',    // Initialize empty but optional
            noun_id: '',
            class_id: ''
        }
    });

    // Transform the data for Select components
    const nounOptions = nouns.map(noun => ({
        value: noun.id,
        label: noun.name,
    }));

    // Filter classes based on selected noun
    const filteredClassOptions = classes
        .filter(cls => cls.noun_id === form.values.noun_id)
        .map(cls => ({
            value: cls.id,
            label: cls.name,
        }));

    // Handle noun selection change
    const handleNounChange = (value: string | null) => {
        form.setFieldValue('noun_id', value || '');
        form.setFieldValue('class_id', '');
    };

    const onSubmit = (values: typeof form.values) => {
        // Create a FormData object
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value.toString());
            }
        });
        
        fetcher.submit(formData, {
            method: "post"
        });
    };

    // Navigate to search page on successful submission
    React.useEffect(() => {
        if (fetcher.data?.success) {
            navigate('/material/search');
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
                            <Text size="xl">Create New Material</Text>
                            <FormError fetcher={fetcher} />

                            <NumberInput
                                label="Material Number"
                                placeholder="Enter material number"
                                withAsterisk
                                {...form.getInputProps('material_number')}
                            />

                            <TextInput
                                label="Description"
                                placeholder="Enter description"
                                withAsterisk
                                {...form.getInputProps('description')}
                            />

                            <Textarea
                                label="Long Text"
                                placeholder="Enter long text description"
                                minRows={3}
                                {...form.getInputProps('long_text')}
                                required={false}
                            />

                            <Textarea
                                label="Details"
                                placeholder="Enter additional details"
                                minRows={3}
                                {...form.getInputProps('details')}
                                required={false}
                            />

                            <Select
                                label="Noun"
                                placeholder="Select a noun"
                                data={nounOptions}
                                withAsterisk
                                searchable
                                value={form.values.noun_id}
                                onChange={handleNounChange}
                            />

                            <Select
                                label="Class"
                                placeholder={form.values.noun_id ? "Select a class" : "Please select a noun first"}
                                data={filteredClassOptions}
                                withAsterisk
                                searchable
                                disabled={!form.values.noun_id}
                                value={form.values.class_id}
                                onChange={(value) => form.setFieldValue('class_id', value || '')}
                            />

                            <Button 
                                type="submit"
                                loading={fetcher.state === "submitting"}
                            >
                                Create Material
                            </Button>
                        </Stack>
                    </Card.Section>
                </Card>
            </form>
        </Center>
    );
}