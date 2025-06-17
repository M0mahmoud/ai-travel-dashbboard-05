import { PagerComponent } from "@syncfusion/ej2-react-grids";
import Header from "components/Header";
import TripCard from "components/TripCard";

export default function TripsSection({
  trips,
  total,
  currentPage,
  onPageChange,
}: {
  trips: Trip[];
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section id="trips" className="py-20 wrapper flex flex-col gap-10">
      <Header
        title="Handpicked Trips"
        description="Browse well-planned trips designes for your travel style"
      />

      <div className="trip-grid">
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
        totalRecordsCount={total}
        pageSize={8}
        currentPage={currentPage}
        click={(args) => onPageChange(args.currentPage)}
        cssClass="!mb-4"
      />
    </section>
  );
}
