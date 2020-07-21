import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { registrationSchema } from "../schema/registration";
import { yupResolver } from "@hookform/resolvers";

const Label = (props) => <label className="block text-gray-700 font-medium mb-1" {...props} />;

const Error = (name) => {
  return <div>error message</div>;
};

export default function IndexPage() {
  const { push } = useRouter();
  const { register, handleSubmit, watch, errors } = useForm<{ plan: string | boolean }>({
    defaultValues: {
      plan: false,
    },
    resolver: yupResolver(registrationSchema),
  });

  console.log(errors);

  const plans = [
    {
      id: "ordinary",
      name: "Ordinary Member",
      price: 10,
      interval: "monthly",
      perks: ["Free open sessions", "Discounts on workshop and events", "Voting rights on community matters"],
    },
    {
      id: "associate",
      name: "Associate member",
      price: 60,
      interval: "yearly",
      perks: ["10 free open sessions", "Support the community"],
    },
  ];

  const handleSignup = (v) => {
    const chosenPlan = plans.find((p) => p.id === plan);
    push({ pathname: "/confirm", query: { ...v, price: chosenPlan.price, interval: chosenPlan.interval } });
  };

  const plan = watch("plan");

  return (
    <div className="py-16">
      <div className="container bg-transparent text-left max-w-lg p-8 mx-auto space-y-8">
        <h1 className="text-4xl font-bold leading-tight border-b pb-4">Registration</h1>
        <form onSubmit={handleSubmit(handleSignup)}>
          <div className="space-y-4">
            {plans.map(({ name, id, price, interval, perks }) => (
              <div className="custom-radio" key={id}>
                <input type="radio" id={id} name="plan" value={id} ref={register()} />
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
          {plan === "ordinary" && (
            <div className="p-4 text-small space-y-4 ">
              <p className="text-sm">
                We only accept membership payments by SEPA direct debit, to minimise our administration and keep
                banking costs as low as possible. This is a highly secure payment method and your personal details
                are kept safe.
              </p>
              <p className="text-sm">
                You will be charged on the first working day of each month and will receive a monthly reminder.
              </p>

              <p className="text-sm">Your membership has no minimum duration and can be cancelled at any time.</p>

              <div>
                <Label htmlFor="name">Name</Label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  ref={register()}
                  className="form-input w-full"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  ref={register()}
                  className="form-input w-full"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="123 Street"
                  ref={register()}
                  className="form-textarea w-full"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <input id="address" name="iban" placeholder="" ref={register()} className="form-input w-full" />
              </div>

              <div>I agree to the code of conduct.</div>

              <div>I agree to the GDPR consent</div>
              <button type="submit" className="btn w-full">
                Next &#187;
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
