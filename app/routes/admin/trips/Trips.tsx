import { Header, TripCard } from "components";
import { parseTripData } from "lib/utils";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/Trips";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 12;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const { trips, total } = await getAllTrips(limit, offset);

  return {
    trips: trips.map(({ $id, itinerary_details, image_url }) => ({
      id: $id,
      ...parseTripData(itinerary_details),
      image_url: image_url || [],
    })),
    total,
  };
};

export default function Trips({ loaderData }: Route.ComponentProps) {
  const trips = loaderData.trips as Trip[] | [];

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <>
      <main className="all-users wrapper">
        <Header
          title="Trips"
          description="View and edit AI-generated travel plans"
          ctaText="Create a trip"
          ctaUrl="/trips/create"
        />

        <section>
          <h1 className="p-24-semibold text-dark-100 mb-4">
            Manage Created Trips
          </h1>

          <div className="trip-grid mb-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.name}
                imageUrl={trip.image_url[0]}
                location={trip.itinerary?.[0]?.location ?? ""}
                tags={[trip.interests, trip.travelStyle]}
                price={trip.estimatedPrice}
              />
            ))}
          </div>

          <PagerComponent
            totalRecordsCount={loaderData.total}
            pageSize={12}
            currentPage={currentPage}
            click={(args) => handlePageChange(args.currentPage)}
            cssClass="!mb-4"
          />
        </section>
      </main>
    </>
  );
}
