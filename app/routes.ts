import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Authentication routes
  route("login", "routes/auth/Login.tsx"),

  // API
  route("api/create-trip", "routes/api/create-trip.ts"),

  // Dashboard routes
  layout("routes/admin/layout.tsx", [
    route("dashboard", "routes/admin/index.tsx"),
    route("users", "routes/admin/users/AllUsers.tsx"),
    route("trips", "routes/admin/trips/Trips.tsx"),
    route("trips/create", "routes/admin/trips/CreateTrip.tsx"),
    route("trips/:tripId", "routes/admin/trips/TripDetails.tsx"),
  ]),

  // Client routes
  layout("routes/client/layout.tsx", [
    index("routes/client/page.tsx"),
    route("/travel/:tripId", "routes/client/TravelDetail.tsx"),
  ]),
] satisfies RouteConfig;
