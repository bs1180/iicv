import { useState } from "react";
import Label from "../components/Label";
import Error from "../components/Error";
import { useForm } from "react-hook-form";
import wretch from "wretch";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();
  const [message, setMessage] = useState<{ status: "success" | "error"; text: string }>();

  const login = async ({ email }) => {
    setMessage(null);
    try {
      await wretch("/api/login")
        .post({
          email,
        })
        .json();
      setMessage({ status: "success", text: "A login link has been emailed to you." });
    } catch {
      setMessage({ status: "error", text: "Unable to login - please try again later" });
    }
  };

  const alertClasses =
    message && message.status === "success"
      ? "bg-blue-100 border-blue-400 text-blue-700 border-l-2"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className="py-8 lg:py-16">
      <div className="container bg-transparent text-left max-w-lg p-8 mx-auto space-y-8">
        <h1 className="text-4xl font-bold leading-tight border-b pb-4">Login</h1>

        <div className="space-y-4">To access your account, please use the email address you signed up with.</div>
        {message && <div className={`p-4 border-l-2 ${alertClasses}`}>{message.text}</div>}
        <form onSubmit={handleSubmit(login)} className="px-4 space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="kate@example.com"
              className="form-input w-full"
              {...register("email", { required: "Required" })}
            />
            <Error message={errors?.email?.message} />
          </div>
          <button type="submit" className="btn w-full">
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
