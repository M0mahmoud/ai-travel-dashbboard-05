import { parseTripData } from "lib/utils";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips } from "~/appwrite/trips";

import { useState } from "react";
import type { Route } from "./+types/page";
import FeaturesSection from "components/Client/HomePage/FeaturesSection";
import HeroSection from "components/Client/HomePage/HeroSection";
import TripsSection from "components/Client/HomePage/TripsSection";
import Footer from "components/Client/Footer";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const [{ trips, total }] = await Promise.all([getAllTrips(limit, offset)]);

  return {
    trips: trips.map(({ $id, itinerary_details, image_url }) => ({
      id: $id,
      ...parseTripData(itinerary_details),
      image_url: image_url || [],
    })),
    total,
  };
};

export default function ClientHomePage({ loaderData }: Route.ComponentProps) {
  const trips = loaderData.trips as Trip[] | [];
  const total = loaderData.total as number;

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <>
      <main className="flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <TripsSection
          trips={trips}
          total={total}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <Footer />
      </main>
    </>
  );
}
