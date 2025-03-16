import { z } from "zod";
import type { Route } from "./+types/confirm";
import { Button, Card, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { redirect, useFetcher } from "react-router";
import { ConfirmRegistrationAction } from "../../server/auth";
import { FormError } from "~/components/common/form-error";

const confirmSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers")
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = {
    email: String(formData.get("email")),
    code: String(formData.get("code")),
  };
  try {
    const result = await ConfirmRegistrationAction(data);
    if (result.success) {
      return redirect("/login");
    }
    return { 
      success: false, 
      error: result.error || "Failed to confirm registration" 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export default function Confirm() {
  let fetcher = useFetcher<{ success: boolean; error: string }>();
  const form = useForm({
    validate: zodResolver(confirmSchema),
    // Ideally we would want to prefill the email from the register route.
  });

  const onSubmit = (values: typeof form.values) => {
    fetcher.submit(values, {
      method: "post",
      action: "/confirm",
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
            <Text>Confirm Account</Text>
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
              label="Verification Code"
              placeholder="Enter 6-digit code"
              key={form.key("code")}
              {...form.getInputProps("code")}
              maxLength={6}
              onChange={(event) => {
                const cleaned = event.currentTarget.value.replace(/\D/g, "").slice(0, 6);
                form.setFieldValue("code", cleaned);
              }}
            />
            <Button 
              type="submit" 
              loading={fetcher.state === "submitting"}
            >
              Verify Account
            </Button>
          </Stack>
        </Card.Section>
      </Card>
    </form>
  );
}
