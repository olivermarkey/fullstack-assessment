import { useEffect, useState } from "react";
import { ApiClient } from "~/lib/api-client";

export function Welcome() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    ApiClient.get("")
      .then(setData)
      .catch(error => console.error("Failed to fetch data:", error));
  }, []);
  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      Home
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
