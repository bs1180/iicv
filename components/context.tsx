import { useState } from "react";

const RegistrationWrapper = ({ children }) => {
  const [details, setDetails] = useState();
  const [chosenPlan, setChosenPlan] = useState();

  return children({ details, setDetails, chosenPlan, setChosenPlan });
};

export default RegistrationWrapper;
