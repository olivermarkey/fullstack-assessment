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
      index("routes/material/index.tsx"),
      route("search", "routes/material/search.tsx"),
      route("edit/:id", "routes/material/edit.tsx"),
      route("create", "routes/material/create.tsx"),
    ]),
    route("configuration", "routes/configuration.tsx"),
    route("bulk-enrichment", "routes/bulk-enrichment.tsx"),
  ]),
  layout("./layouts/auth-layout.tsx", [
    route("register", "routes/auth/register.tsx"),
    route("confirm", "routes/auth/confirm.tsx"),
    route("login", "routes/auth/login.tsx"),
    route("logout", "routes/auth/logout.tsx"),
  ]),
] satisfies RouteConfig;
