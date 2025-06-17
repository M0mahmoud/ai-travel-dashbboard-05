import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section className="travel-hero">
      <div>
        <section className="wrapper">
          <article>
            <h1 className="p-72-bold text-dark-100">
              Plan Your Trip with Ease
            </h1>

            <p className="text-dark-100">
              Customize your travel itinerary in minutes—pick your destination,
              set your preferences, and explore with confidence.
            </p>
          </article>

          <Link to="#trips">
            <ButtonComponent
              type="button"
              className="button-class !h-11 !w-full md:!w-[240px]"
            >
              <span className="p-16-semibold text-white">Get Started</span>
            </ButtonComponent>
          </Link>
        </section>
      </div>
    </section>
  );
}
