import { z } from "zod";
import type { Route } from "./+types/login";
import { Button, Card, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, redirect, useFetcher } from "react-router";
import { FormError } from "~/components/common/form-error";
import { LoginAction } from "~/server/auth";
import { useAuthContext } from "~/components/auth/auth-provider";
import React from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };
  try {
    const result = await LoginAction(data);
    if (result.success) {
      return { 
        success: true,
        tokens: result.tokens,
        user: result.user
      };
    }
    return { 
      success: false, 
      error: result.error || "Login failed" 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export default function Login() {
  let fetcher = useFetcher<{ success: boolean; error: string; tokens?: any; user?: any }>();
  const { setTokens } = useAuthContext();
  const form = useForm({
    validate: zodResolver(loginSchema),
  });

  const onSubmit = (values: typeof form.values) => {
    fetcher.submit(values, {
      method: "post",
      action: "/login",
    });
  };

  // Handle successful login
  React.useEffect(() => {
    if (fetcher.data?.success && fetcher.data.tokens) {
      console.log('Login success data:', fetcher.data); // Debug log
      setTokens({
        tokens: fetcher.data.tokens,
        user: fetcher.data.user
      });
    }
  }, [fetcher.data, setTokens]);

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
            <Text>Login</Text>
            <FormError fetcher={fetcher} />
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
            <Button 
              type="submit"
              loading={fetcher.state === "submitting"}
            >
              Login
            </Button>
            <Link to="/register">
              <Text size="sm" c="dimmed" td="underline">
                Don't have an account? Register
              </Text>
            </Link>
          </Stack>
        </Card.Section>
      </Card>
    </form>
  );
}
