import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { plans } from "../utils/plans";
import Router from "next/router";
import axios from "redaxios";

const ConfirmationPage = () => {
  const { query } = useRouter();
  const [mandate_id] = useState(Math.random().toString(36).slice(-6));
  const chosenPlan = plans.find((p) => p.id === query.plan);
  const [errors, setErrors] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  if (!chosenPlan) {
    return <div>Error - invalid plan</div>;
  }

  const handleConfirmation = async (e) => {
    setErrors(null);
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
        ...query,
        mandate_id,
      });
      Router.push("/thanks");
    } catch (err) {
      setErrors("Sorry, an error occurred - your registration has not been submitted");
    } finally {
      setSubmitting(false);
    }
  };

  const { name, address, iban } = query;

  return (
    <div className="py-8 lg:py-16">
      <div className="bg-transparent text-left max-w-lg mx-auto space-y-8">
        <h1 className="text-4xl font-bold leading-tight border-b pb-4">Complete registration</h1>
        <div className="shadow bg-white p-4 space-y-4 rounded">
          <h2 className="font-semibold text-xl pb-2 border-b">SEPA Direct Debit Mandate</h2>

          <table className="w-full custom-details">
            <tbody>
              <tr>
                <td>Mandate reference</td>
                <td>{mandate_id}</td>
              </tr>
              <tr>
                <td>Payment type</td>
                <td>{chosenPlan.mandateType}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-semibold text-md border-b pb-2">Creditor</h3>
          <div className="space-y-1">
            <table className="w-full custom-details">
              <tbody>
                <tr>
                  <td>Creditor ID</td>
                  <td>AT79ZZZ00000067772</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>International Improv Community in Vienna</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>Semmelweisgasse 7, 1210 Wien</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-semibold text-md border-b pb-2">Debtor</h3>
          <table className="w-full custom-details">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{name}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{address}</td>
              </tr>
              <tr>
                <td>IBAN</td>
                <td>{iban}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-sm space-y-4">
            <p>
              By accepting this mandate form, you authorize International Improv Community in Vienna (IICV) to send
              instructions to your bank to debit your account and your bank to debit your account in accordance
              with instructions from the IICV. You also agree to receive notifications for future debits up to 2
              days before they occur.
            </p>
            <p>
              You are entitled to a refund from your bank under the terms and conditions of your agreement with
              your bank. A refund must be claimed within eight weeks starting from the date on which your account
              was debited.
            </p>
            <p>Your rights are explained in a statement that you can obtain from your bank.</p>
            {errors && (
              <div className="text-red-500 space-y-2">
                <div>{errors}</div>
              </div>
            )}
            <form onSubmit={handleConfirmation}>
              <button type="submit" className="btn w-full">
                {submitting ? (
                  "Submitting..."
                ) : chosenPlan.mandateType === "recurring" ? (
                  <>
                    Confirm subscription of €{chosenPlan.price} {chosenPlan.interval}
                  </>
                ) : (
                  <>Confirm one-off payment of €{chosenPlan.price}</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
