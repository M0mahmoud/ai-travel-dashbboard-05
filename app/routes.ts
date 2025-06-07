import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/admin/layout.tsx", [
    route("dashboard", "routes/admin/index.tsx"),
    route("dashboard/users", "routes/admin/users/AllUsers.tsx"),
  ]),
] satisfies RouteConfig;
