import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { email, name, newsletter = false, priceId, paymentMethodId } = req.body;
  if (!email || !name || !priceId || !paymentMethodId) {
    return res.status(400).json({ error: "Missing params" });
  }
  try {
    const customers = await stripe.customers.list({ limit: 100, expand: ["data.subscriptions"] });

    let customer = customers.data.find((c) => c.email === email);

    if (!customer) {
      customer = await stripe.customers.create({
        name,
        email,
        metadata: { newsletter },
      });
    }

    const hasActive = customer.subscriptions.data.find((s) => s.status === "active");

    if (hasActive) {
      return res.json({
        error: "An active subscription already exists for this email address.",
      });
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: req.body.priceId }],
      expand: ["latest_invoice.payment_intent"],
      // This ensures we only bill the associate membership once, by letting it cancel automatically
      cancel_at_period_end: priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FOR_ASSOCIATE_MEMBERSHIP,
    });
    console.log("Successful payment");
    return res.json((subscription.latest_invoice as Stripe.Invoice).payment_intent);
  } catch (err) {
    console.log("Error during payment");
    console.error(err);
    switch (err.type) {
      case "StripeCardError":
        return res.json({ error: err.message });
      case "StripeRateLimitError":
      case "StripeInvalidRequestError":
      case "StripeAPIError":
      case "StripeConnectionError":
      case "StripeAuthenticationError":
        return res.json({ error: "Sorry, a technical error occurred. Your payment has not been processed." });
      default:
        throw err.type;
    }
  }
};
