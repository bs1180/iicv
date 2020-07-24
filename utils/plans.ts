export const plans = [
  {
    id: "ordinary",
    name: "Membership",
    price: 10,
    interval: "monthly",
    mandateType: "recurring",
    perks: ["Free open sessions", "Discounts on workshop and events", "Voting rights on community matters"],
    details: [
      "You will be charged on the first working day of each month and will receive a monthly reminder.",
      "Your membership has no minimum duration and can be cancelled at any time.",
    ],
  },
  {
    id: "associate",
    name: "Associate Membership",
    price: 60,
    interval: "yearly",
    mandateType: "one-off",
    perks: ["Free entry to performances", "Support the community"],
    details: ["You will be charged only once and your membership will not automatically renew."],
  },
];
