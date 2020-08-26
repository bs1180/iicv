import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { registrationSchema } from "../utils/registration";
import { yupResolver } from "@hookform/resolvers";
import wretch from "wretch";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentFields from "../components/PaymentFields";
import Label from "./Label";
import Error from "./Error";

export default function RegistrationForm({ plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string>();
  const router = useRouter();

  const { register, handleSubmit, errors, formState } = useForm<any>({
    resolver: yupResolver(registrationSchema),
  });

  const handleSignup = async ({ name, email, newsletter }) => {
    setPaymentError(null);
    const priceId = plan.stripePriceId;

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setPaymentError(error.message);
    } else {
      const res = await wretch("/api/subscribe")
        .post({
          paymentMethodId: paymentMethod.id,
          priceId,
          name,
          email,
          newsletter,
        })
        .json();

      if (res.error) {
        setPaymentError(res.error);
      } else if (res.status === "requires_payment_method") {
        setPaymentError("Your card was declined.");
      } else if (res.status === "requires_action") {
        await stripe
          .confirmCardPayment(res.client_secret, {
            payment_method: paymentMethod.id,
          })
          .then((res) => {
            if (res.error) {
              setPaymentError(res.error.message);
            } else if (res.paymentIntent?.status === "succeeded") {
              router.push("/thanks");
            }
          });
      } else if (res.status === "succeeded") {
        router.push("/thanks");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignup)} className="px-4 space-y-4">
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
        <Error message={errors?.name?.message} />
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
        <Error message={errors?.email?.message} />
      </div>
      {/* <div>
        <Label htmlFor="address">Address</Label>
        <textarea
          id="address"
          name="address"
          placeholder="Hauptstraße 12/3"
          ref={register()}
          className="form-textarea w-full"
          rows={3}
          style={{ resize: "none" }}
        />
        <Error message={errors?.address?.message} />
      </div> */}

      <PaymentFields />
      <Error message={paymentError} />
      <div>
        <label className="flex items-center">
          <input name="newsletter" type="checkbox" className="form-checkbox" ref={register()} />
          <span className="ml-2">Yes, sign me up for the newsletter</span>
        </label>
      </div>

      <button type="submit" className="btn w-full">
        {formState.isSubmitting ? (
          "Submitting..."
        ) : plan.mandateType === "recurring" ? (
          <>
            Confirm subscription of €{plan.price} {plan.interval}
          </>
        ) : (
          <>Confirm one-off payment of €{plan.price}</>
        )}
      </button>
    </form>
  );
}
