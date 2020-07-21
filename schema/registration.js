import * as yup from "yup";
import iban from "iban";

export const registrationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  iban: yup.string().required().test("isIban", "Invalid IBAN", iban.isValid),
});
