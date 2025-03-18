import { useState, useEffect } from "react";
import { Grid, Card, Stack, Text, Button, TextInput, Modal, Group, Switch, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLoaderData, useFetcher } from "react-router";
import { z } from "zod";
import { ApiClient } from "~/lib/api-client";
import { type Noun, type Class, nounSchema, classSchema, createNounSchema, createClassSchema } from "@fullstack-assessment/shared";
import { IconPlus } from "@tabler/icons-react";
import { FormError } from "~/components/common/form-error";

// Loader schema
const loaderSchema = z.object({
  nouns: z.array(nounSchema),
  classes: z.array(classSchema)
});

export async function loader({ request }: { request: Request }) {
  const [nouns, classes] = await Promise.all([
    ApiClient.get("/nouns", { 
      schema: z.array(nounSchema),
      request
    }),
    ApiClient.get("/classes", { 
      schema: z.array(classSchema),
      request
    })
  ]);

  return loaderSchema.parse({ nouns, classes });
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "createNoun") {
      const data = {
        name: String(formData.get("name")),
        active: formData.get("active") === "true"
      };
      await ApiClient.post("/nouns", data, { 
        schema: nounSchema,
        request
      });
    } else if (intent === "createClass") {
      const data = {
        name: String(formData.get("name")),
        noun_id: String(formData.get("noun_id")),
        active: formData.get("active") === "true"
      };
      await ApiClient.post("/classes", data, { 
        schema: classSchema,
        request
      });
    } else if (intent === "updateNoun") {
      const data = {
        active: formData.get("active") === "true"
      };
      const id = String(formData.get("id"));
      await ApiClient.patch(`/nouns/${id}`, data, { 
        schema: nounSchema,
        request
      });
    } else if (intent === "updateClass") {
      const data = {
        active: formData.get("active") === "true"
      };
      const id = String(formData.get("id"));
      await ApiClient.patch(`/classes/${id}`, data, { 
        schema: classSchema,
        request
      });
    }
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export default function Configuration() {
  const { nouns, classes } = useLoaderData<typeof loader>();
  const [selectedNoun, setSelectedNoun] = useState<Noun | null>(null);
  const [openedNoun, { open: openNoun, close: closeNoun }] = useDisclosure(false);
  const [openedClass, { open: openClass, close: closeClass }] = useDisclosure(false);
  const fetcher = useFetcher();

  // Filter classes based on selected noun
  const filteredClasses = classes.filter(
    cls => selectedNoun && cls.noun_id === selectedNoun.id
  );

  // Add this effect to handle modal closing
  useEffect(() => {
    if (fetcher.data?.success) {
      const lastIntent = fetcher.formData?.get("intent");
      if (lastIntent === "createNoun") {
        closeNoun();
      } else if (lastIntent === "createClass") {
        closeClass();
      }
    }
  }, [fetcher.data?.success, fetcher.formData]);

  return (
    <Stack>
      <Text size="xl">Configuration</Text>
      <Grid>
        {/* Nouns Column */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Nouns</Text>
              <Button 
                leftSection={<IconPlus size={14} />}
                size="sm"
                onClick={openNoun}
              >
                Add Noun
              </Button>
            </Group>
            <Stack>
              {nouns.map(noun => (
                <Card 
                  key={noun.id}
                  padding="sm"
                  withBorder
                  onClick={() => setSelectedNoun(noun)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedNoun?.id === noun.id ? 'var(--mantine-color-blue-0)' : undefined
                  }}
                >
                  <Group justify="space-between">
                    <Text>{noun.name}</Text>
                    <Tooltip label={noun.active ? "Set as inactive" : "Set as active"}>
                      <div style={{ display: 'inline-block' }}>
                        <Switch 
                          checked={noun.active}
                          onChange={(event) => {
                            event.stopPropagation();
                            const formData = new FormData();
                            formData.append("intent", "updateNoun");
                            formData.append("id", noun.id);
                            formData.append("active", String(!noun.active));
                            fetcher.submit(formData, { method: "patch" });
                          }}
                        />
                      </div>
                    </Tooltip>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Classes Column */}
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Classes</Text>
              <Button 
                leftSection={<IconPlus size={14} />}
                size="sm"
                onClick={openClass}
                disabled={!selectedNoun}
              >
                Add Class
              </Button>
            </Group>
            <Stack>
              {filteredClasses.map(cls => (
                <Card 
                  key={cls.id}
                  padding="sm"
                  withBorder
                >
                  <Group justify="space-between">
                    <Text>{cls.name}</Text>
                    <Tooltip label={cls.active ? "Set as inactive" : "Set as active"}>
                      <div style={{ display: 'inline-block' }}>
                        <Switch 
                          checked={cls.active}
                          onChange={() => {
                            const formData = new FormData();
                            formData.append("intent", "updateClass");
                            formData.append("id", cls.id);
                            formData.append("active", String(!cls.active));
                            fetcher.submit(formData, { method: "patch" });
                          }}
                        />
                      </div>
                    </Tooltip>
                  </Group>
                </Card>
              ))}
              {selectedNoun && filteredClasses.length === 0 && (
                <Text c="dimmed" ta="center">No classes found for this noun</Text>
              )}
              {!selectedNoun && (
                <Text c="dimmed" ta="center">Select a noun to view its classes</Text>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Add Noun Modal */}
      <Modal opened={openedNoun} onClose={closeNoun} title="Add New Noun">
        <fetcher.Form method="post">
          <Stack>
            <FormError fetcher={fetcher} />
            <input type="hidden" name="intent" value="createNoun" />
            <input type="hidden" name="active" value="true" />
            
            <TextInput
              label="Name"
              name="name"
              placeholder="Enter noun name"
              required
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={closeNoun}>Cancel</Button>
              <Button type="submit">Add Noun</Button>
            </Group>
          </Stack>
        </fetcher.Form>
      </Modal>

      {/* Add Class Modal */}
      <Modal opened={openedClass} onClose={closeClass} title="Add New Class">
        <fetcher.Form method="post">
          <Stack>
            <FormError fetcher={fetcher} />
            <input type="hidden" name="intent" value="createClass" />
            <input type="hidden" name="active" value="true" />
            <input type="hidden" name="noun_id" value={selectedNoun?.id || ''} />
            
            <TextInput
              label="Name"
              name="name"
              placeholder="Enter class name"
              required
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={closeClass}>Cancel</Button>
              <Button type="submit">Add Class</Button>
            </Group>
          </Stack>
        </fetcher.Form>
      </Modal>
    </Stack>
  );
}