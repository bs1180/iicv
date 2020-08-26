import { useState } from "react";
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import Label from "./Label";

const baseStyles = {
  style: {
    base: {
      backgroundColor: "#fff",
      fontFamily: "Inter var, system-ui, -apple-system",
      fontSize: "16px",
      lineHeight: "24px",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
  },
  hidePostalCode: true,
};

function useCustomClasses(extra?: string): any {
  const [focused, setFocused] = useState(false);
  const classes = focused ? "form-input w-full custom-form-focus outline-none" : "form-input w-full";

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return [handleFocus, handleBlur, classes];
}

const PaymentFields = () => {
  const [handleFocus, handleBlur, classes] = useCustomClasses();

  return (
    <>
      <div>
        <Label>Payment Details</Label>
        <CardElement className={classes} onFocus={handleFocus} onBlur={handleBlur} options={baseStyles} />
      </div>
    </>
  );
};

export default PaymentFields;
