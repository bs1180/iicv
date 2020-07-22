import firebase from "firebase/app";
import "firebase/auth";
import { initFirebase } from "./firebase";

initFirebase();

export const fetcher = (query) => async () => {
  const Bearer = await firebase.auth().currentUser.getIdToken();

  return fetch(`${process.env.NEXT_PUBLIC_URL}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Bearer },
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json());
};
