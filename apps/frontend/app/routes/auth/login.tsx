import { z } from "zod";
import type { Route } from "./+types/login";
import { Button, Card, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, redirect, useFetcher } from "react-router";
import { FormError } from "~/components/common/form-error";
import { LoginAction } from "~/server/auth";
import { useAuthContext } from "~/components/auth/auth-provider";
import React from "react";
import { IconEyeOff, IconEye } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { serialize } from "cookie";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  try {
    const result = await LoginAction(data);
    console.log('[Login] Login action result:', { success: result.success, hasToken: !!result.tokens?.AccessToken });
    
    if (result.success && result.tokens?.AccessToken) {
      // Base64 encode the token to ensure it's cookie-safe
      const encodedToken = Buffer.from(result.tokens.AccessToken).toString('base64');
      // Create the session cookie with the encoded access token
      const cookie = serialize('session_id', encodedToken, COOKIE_OPTIONS);
      
      // Return tokens and user info to the client
      return new Response(JSON.stringify({ 
        success: true,
        tokens: result.tokens,
        user: result.user
      }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      });
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
  const [visible, { toggle }] = useDisclosure(false);
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
