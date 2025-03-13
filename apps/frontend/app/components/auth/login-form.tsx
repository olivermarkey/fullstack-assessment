import { z } from "zod";
import { Button, Card, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm() {
  const form = useForm({
    validate: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Card
        shadow="sm"
        radius="md"
        withBorder
        w={{ base: 300, xs: 350, md: 400 }}
      >
        <Card.Section p="lg">
          <Stack>
            <Text>Login</Text>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <TextInput
              withAsterisk
              label="Password"
              placeholder="Password"
              type="password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button type="submit">Login</Button>
          </Stack>
        </Card.Section>
      </Card>
    </form>
  );
}
