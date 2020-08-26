import { useState } from "react";
import { plans } from "../utils/plans";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import RegistrationForm from "../components/RegistrationForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function IndexPage() {
  const [plan, setPlan] = useState();

  const chosenPlan = plans.find((p) => p.id === plan);

  const handleChange = (e) => {
    setPlan(e.currentTarget.value);
  };

  return (
    <div className="py-8 lg:py-16">
      <div className="container bg-transparent text-left max-w-lg p-8 mx-auto space-y-8">
        <h1 className="text-4xl font-bold leading-tight border-b pb-4">Registration</h1>

        <div className="space-y-4">
          {plans.map(({ name, id, price, interval, perks }) => (
            <div className="custom-radio" key={id}>
              <input type="radio" id={id} name="plan" value={id} onChange={handleChange} />
              <label htmlFor={id}>
                <div className="flex  mb-3">
                  <div className="font-semibold">{name}</div>
                  <div className="ml-auto text-gray-400">
                    €{price} {interval}
                  </div>
                </div>
                <ul className="list-none">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-center">
                      <svg
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4 inline mr-1 text-blue-700"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </label>
            </div>
          ))}
        </div>
        {plan && (
          <div className="px-4 space-y-4">
            <p className="text-sm">We process membership payments securely using Stripe.</p>
            {chosenPlan.details.map((d, i) => (
              <p key={i} className="text-sm" children={d} />
            ))}
          </div>
        )}
        <Elements stripe={stripePromise}>{plan && <RegistrationForm plan={chosenPlan} />}</Elements>
      </div>
    </div>
  );
}
