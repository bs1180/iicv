import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email().required("Required"),
  newsletter: yup.boolean().nullable(),
});
