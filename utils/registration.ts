import * as yup from "yup";
import iban from "iban";

export const registrationSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email().required("Required"),
  address: yup.string().required("Required"),
  iban: yup.string().required("Required").test("isIban", "Invalid IBAN", iban.isValid),
});
