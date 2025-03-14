import type { Route } from "./+types/home";
import { Welcome } from "../components/welcome/welcome";
import { useAuthContext } from "~/components/auth/auth-provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
