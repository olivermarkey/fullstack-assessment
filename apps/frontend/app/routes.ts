import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("create", "routes/create-material.tsx"),
    route("search", "routes/search.tsx"),
    route("configuration", "routes/configuration.tsx"),
  ]),
  layout("./layouts/auth-layout.tsx", [
    route("register", "routes/register.tsx"),
    route("confirm", "routes/confirm.tsx"),
    route("login", "routes/login.tsx"),
  ]),
] satisfies RouteConfig;
