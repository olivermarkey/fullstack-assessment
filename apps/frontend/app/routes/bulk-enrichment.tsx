import { Button } from "@mantine/core";
import type { Route } from "./+types/bulk-enrichment";
import { getAccessTokenFromCookie } from "~/lib/get-cookie";
import { ApiClient } from "~/lib/api-client";
import { Form, useNavigation } from "react-router";
import { useEffect, useRef } from "react";

export async function action({ request }: Route.ClientActionArgs) {
  const accessToken = getAccessTokenFromCookie(request);
  
  // Get the response as a blob
  const response = await fetch(`${process.env.API_URL || 'http://localhost:8080/api'}/materials/bulk-enrichment`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download template');
  }

  // Convert the response to base64
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return { base64, filename: 'Bulk Enrichment Template.xlsx' };
}

export default function BulkEnrichment({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const downloadTriggered = useRef(false);

  useEffect(() => {
    // Only trigger download if we have data and haven't downloaded yet
    if (actionData?.base64 && actionData?.filename && !downloadTriggered.current) {
      downloadTriggered.current = true;
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${actionData.base64}`;
      link.download = actionData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      <h1>Bulk Enrichment</h1>
      <Form method="post">
        <Button 
          type="submit" 
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Downloading...' : 'Download Template'}
        </Button>
      </Form>
    </div>
  );
}
