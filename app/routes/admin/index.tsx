import { Header, StatsCard, TripCard } from "components";
import { getUser } from "~/appwrite/user";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";
import type { Route } from "./+types/layout";
import {
  Category,
  ChartComponent,
  ColumnDirective,
  ColumnsDirective,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "lib/utils";
import { GridComponent } from "@syncfusion/ej2-react-grids";

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    // allUsers,
  ] = await Promise.all([
    await getUser(),
    await getUsersAndTripsStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    // await getAllUsers(4, 0),
  ]);

  const allTrips = trips.trips.map(({ $id, itinerary_details, image_url }) => ({
    id: $id,
    ...parseTripData(itinerary_details),
    image_url: image_url || [],
  }));

  // const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
  //   image_url: user.image_url,
  //   name: user.name,
  //   count: user.itineraryCount ?? Math.floor(Math.random() * 10),
  // }));

  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    // allUsers: mappedUsers,
  };
};

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const {
    // @ts-ignore
    dashboardStats,
    // @ts-ignore
    user,
    // @ts-ignore
    allTrips,
    // @ts-ignore
    userGrowth,
    // @ts-ignore
    tripsByTravelStyle,
    // @ts-ignore
    // allUsers,
  } = loaderData;

  const trips = allTrips.map((trip: Trip) => ({
    image_url: trip.image_url[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    // {
    //   title: "Latest user signups",
    //   dataSource: allUsers,
    //   field: "count",
    //   headerText: "Trips created",
    // },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome back, ${user.name}!`}
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
          {allTrips.map((trip: Trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name!}
              imageUrl={trip.image_url[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={trip.interests?.split(",") || []}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />

            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71, 132, 238, 0.3)"
              border={{ width: 2, color: "#4784EE" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trip Trends"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="day"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>

      <section className="user-trip wrapper">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div key={i} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>

            <GridComponent dataSource={dataSource} gridLines="None">
              <ColumnsDirective>
                <ColumnDirective
                  // @ts-ignore
                  field="name"
                  headerText="Name"
                  width="200"
                  textAlign="Left"
                  template={(props: UserData) => (
                    <div className="flex items-center gap-1.5 px-4">
                      <img
                        src={props.image_url}
                        alt="user"
                        className="rounded-full size-8 aspect-square"
                        referrerPolicy="no-referrer"
                      />
                      <span>{props.name}</span>
                    </div>
                  )}
                />

                <ColumnDirective
                  // @ts-ignore
                  field={field}
                  headerText={headerText}
                  width="150"
                  textAlign="Left"
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
}
