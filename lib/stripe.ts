import Stripe from "stripe";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const createStripeProduct = async (
  name: string,
  description: string,
  images: string[],
  price: number,
  tripId: string
) => {
  try {
    const product = await stripeClient.products.create({
      name,
      description,
      images,
    });

    const priceData = await stripeClient.prices.create({
      currency: "usd",
      product: product.id,
      unit_amount: price * 100, // Convert to cents
    });

    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [
        {
          price: priceData.id,
          quantity: 1,
        },
      ],
      metadata: {
        tripId,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.VITE_BASE_URL}/travel/${tripId}/success`,
        },
      },
    });
    return paymentLink;
  } catch (error) {
    console.error("Error creating Stripe product:", error);
    throw error;
  }
};
