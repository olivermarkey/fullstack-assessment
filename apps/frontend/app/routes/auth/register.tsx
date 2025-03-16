import { z } from "zod";
import type { Route } from "./+types/register";
import { Button, Card, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, redirect, useFetcher } from "react-router";
import { RegisterAction } from "../../server/auth";
import { FormError } from "~/components/common/form-error";
import { IconEyeOff, IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasLower && hasUpper && hasNumber;
      },
      {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
    )
});

// Important to note: password is sent as plain text, this should only be sent over HTTPS.

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };
  try {
    const result = await RegisterAction(data);
    if (result.success) {
      return redirect("/confirm");
    }
    return { 
      success: false, 
      error: result.error || "Registration failed" 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export default function Register() {
  const [visible, { toggle }] = useDisclosure(false);
  let fetcher = useFetcher<{ success: boolean; error: string }>();
  const form = useForm({
    validate: zodResolver(registerSchema),
  });

  const onSubmit = (values: typeof form.values) => {
    fetcher.submit(values, {
      method: "post",
      action: "/register",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Card
        shadow="sm"
        radius="md"
        withBorder
        w={{ base: 300, xs: 350, md: 400 }}
      >
        <Card.Section p="lg">
          <Stack>
            <Text>Register</Text>
            <FormError fetcher={fetcher} />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              visible={visible}
              onVisibilityChange={toggle}
              visibilityToggleIcon={({ reveal }) => (reveal ? <IconEyeOff/> : <IconEye />)}
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button 
              type="submit"
              loading={fetcher.state === "submitting"}
            >
              Register
            </Button>
            <Link to="/login">
              <Text size="sm" c="dimmed" td="underline">
                Already have an account? Login
              </Text>
            </Link>
          </Stack>
        </Card.Section>
      </Card>
    </form>
  );
}
