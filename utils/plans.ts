export const plans = [
  {
    id: "ordinary",
    name: "Membership",
    price: 10,
    interval: "monthly",
    mandateType: "recurring",
    perks: ["Free open sessions", "Discounts on workshop and events", "Voting rights on community matters"],
    details: [
      "Your membership will begin immediately, and your card will be changed on the same day every month.",
      "Your membership has no minimum duration and can be easily cancelled at any time.",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FOR_ORDINARY_MEMBERSHIP,
  },
  {
    id: "associate",
    name: "Associate Membership",
    price: 60,
    interval: "yearly",
    mandateType: "one-off",
    perks: ["Free entry to performances", "Support the community"],
    details: ["You will be charged only once and your membership will not automatically renew."],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FOR_ASSOCIATE_MEMBERSHIP,
  },
];
