import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    ...prefix("material", [
      route("search", "routes/material/search.tsx"),
      route("edit/:id", "routes/material/edit.tsx"),
      route("create", "routes/material/create.tsx"),
    ]),
    route("configuration", "routes/configuration.tsx"),
  ]),
  layout("./layouts/auth-layout.tsx", [
    route("register", "routes/auth/register.tsx"),
    route("confirm", "routes/auth/confirm.tsx"),
    route("login", "routes/auth/login.tsx"),
  ]),
] satisfies RouteConfig;
