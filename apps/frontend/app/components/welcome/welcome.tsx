import { useEffect, useState } from "react";

export function Welcome() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('http://localhost:8080/api')
      .then(res => res.json())
      .then(setData);
  }, []);
  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4">
      Home
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
