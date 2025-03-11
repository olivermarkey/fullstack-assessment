import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("plant", "routes/plant.tsx"),
  ]),
] satisfies RouteConfig;
