import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  // Authentication routes
  route("login", "routes/auth/Login.tsx"),

  // Dashboard routes
  layout("routes/admin/layout.tsx", [
    route("dashboard", "routes/admin/index.tsx"),
    route("users", "routes/admin/users/AllUsers.tsx"),
  ]),
] satisfies RouteConfig;
