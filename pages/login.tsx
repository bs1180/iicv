import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import Router from "next/router";
import cookie from "js-cookie";

import "firebase/auth";
import { initFirebase } from "../utils/firebase";

initFirebase();

const Label = (props) => <label className="block text-gray-700 font-medium mb-1" {...props} />;

const Error = ({ message }) => {
  return message ? <div className="text-red-500 text-sm p-1">{message}</div> : null;
};

const actionCodeSettings = {
  // TODO: Get from env vars
  url: "http://localhost:3000/login",
  handleCodeInApp: true,
};

const Login = () => {
  const [error, setError] = useState();
  const [instruction, setInstruction] = useState(
    "Please enter the email address used to create your account and we will email you a login link."
  );
  const [label, setLabel] = useState("Login");

  const { handleSubmit, register, errors } = useForm();

  const completeLogin = (email) => {
    firebase
      .auth()
      .signInWithEmailLink(email, window.location.href)
      .then(async function ({ user }) {
        const token = await user.getIdToken();
        cookie.set("user", token, { expires: 7, sameSite: "strict" });
        window.localStorage.removeItem("emailForSignIn");
        Router.push("/dashboard");
      })
      .catch(function (error) {
        console.log(error);
        setError(error.message);
        Router.push("/login");
        setInstruction("");
        setLabel("Login");
      });
  };

  useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        completeLogin(email);
      } else {
        setInstruction("Please re-enter your email address for confirmation");
        setLabel("Complete login");
      }
    }
  }, []);

  const handleLogin = async ({ email }) => {
    setError(undefined);
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      completeLogin(email);
    } else {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setInstruction("Login link sent - please check your email");
    }
  };

  return (
    <div className="flex items-center min-h-screen">
      <form onSubmit={handleSubmit(handleLogin)} className="max-w-md mx-auto bg-transparent space-y-8 w-full">
        <h1 className="text-4xl font-bold leading-tight border-b pb-4">Login</h1>
        <div>{instruction}</div>
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="john@example.com"
            ref={register({ required: "Required" })}
            className="form-input w-full"
          />
          <Error message={errors?.email?.message} />
        </div>

        <button type="submit" className="btn">
          {label}
        </button>
      </form>
    </div>
  );
};

export default Login;
