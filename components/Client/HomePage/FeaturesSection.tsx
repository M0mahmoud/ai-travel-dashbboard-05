import Header from "components/Header";
import { cn } from "lib/utils";

export default function FeaturesSection() {
  return (
    <section className="pt-20 wrapper flex flex-col gap-10 h-full">
      <Header
        title="Featured Travel Destinations"
        description="Check out some of the best places you visit around the world"
      />
      <div className="featured">
        <article>
          <FeaturedDestination
            bgImage="bg-card-1"
            containerClass="h-1/3 lg:h-1/2"
            bigCard
            title="Barcelona Tour"
            rating={4.2}
            activityCount={196}
          />

          <div className="travel-featured">
            <FeaturedDestination
              bgImage="bg-card-2"
              bigCard
              title="London"
              rating={4.5}
              activityCount={512}
            />
            <FeaturedDestination
              bgImage="bg-card-3"
              bigCard
              title="Australia Tour"
              rating={3.5}
              activityCount={250}
            />
          </div>
        </article>

        <div className="flex flex-col gap-[30px]">
          <FeaturedDestination
            containerClass="w-full h-[240px]"
            bgImage="bg-card-4"
            title="Spain Tour"
            rating={3.8}
            activityCount={150}
          />
          <FeaturedDestination
            containerClass="w-full h-[240px]"
            bgImage="bg-card-5"
            title="Japan"
            rating={5}
            activityCount={150}
          />
          <FeaturedDestination
            containerClass="w-full h-[240px]"
            bgImage="bg-card-6"
            title="Italy Tour"
            rating={4.2}
            activityCount={500}
          />
        </div>
      </div>
    </section>
  );
}

const FeaturedDestination = ({
  containerClass,
  bgImage,
  title,
  rating,
  activityCount,
  bigCard = false,
}: {
  containerClass?: string;
  bgImage: string;
  title: string;
  rating: number;
  activityCount: number;
  bigCard?: boolean;
}) => {
  return (
    <section
      className={cn(
        "rounded-[14px] overflow-hidden bg-cover bg-center size-full min-w-[280px]",
        containerClass,
        bgImage
      )}
    >
      <div className="bg-linear200 h-full">
        <article className="featured-card">
          <div
            className={cn(
              "bg-white rounded-20 font-bold text-red-100 w-fit py-px px-3 text-sm"
            )}
          >
            {rating}
          </div>

          <article className="flex flex-col gap-3.5">
            <h2
              className={cn("text-lg font-semibold text-white", {
                "p-30-bold": bigCard,
              })}
            >
              {title}
            </h2>

            <figure className="flex gap-2 items-center">
              <img
                src="/assets/images/david.webp"
                alt="user"
                className={cn("size-4 rounded-full aspect-square", {
                  "size-11": bigCard,
                })}
              />
              <p
                className={cn("text-xs font-normal text-white", {
                  "text-lg": bigCard,
                })}
              >
                {activityCount} activities
              </p>
            </figure>
          </article>
        </article>
      </div>
    </section>
  );
};
