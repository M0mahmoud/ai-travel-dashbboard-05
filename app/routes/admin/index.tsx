import { Header, StatsCard, TripCard } from "components";
import { allTrips } from "~/constants";

const dashboardStats = {
  totalUsers: 1500,
  usersJoined: {
    currentMonth: 120,
    lastMonth: 100,
  },
  totalTrips: 300,
  tripsCreated: {
    currentMonth: 45,
    lastMonth: 300,
  },
  userRole: {
    total: 500,
    currentMonth: 50,
    lastMonth: 50,
  },
};

export default function AdminDashboard() {
  return (
    <main className="dashboard wrapper">
      <Header
        title="Admin Dashboard"
        description="Manage your application settings and users"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <StatsCard
          headerTitle="Total Users"
          total={dashboardStats.totalUsers}
          currentMonthCount={dashboardStats.usersJoined.currentMonth}
          lastMonthCount={dashboardStats.usersJoined.lastMonth}
        />
        <StatsCard
          headerTitle="Total Trips"
          total={dashboardStats.totalTrips}
          currentMonthCount={dashboardStats.tripsCreated.currentMonth}
          lastMonthCount={dashboardStats.tripsCreated.lastMonth}
        />
        <StatsCard
          headerTitle="Active Users"
          total={dashboardStats.userRole.total}
          currentMonthCount={dashboardStats.userRole.currentMonth}
          lastMonthCount={dashboardStats.userRole.lastMonth}
        />
      </div>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name!}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={trip.tags}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
