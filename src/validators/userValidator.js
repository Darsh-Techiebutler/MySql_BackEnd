import yup from "yup";
const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username should have at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters"),
  role: yup
    .string()
    .oneOf(["admin", "superadmin", "user"], "Invalid role")
    .default("user"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup.string().required("Password is required"),
});

export { registrationSchema, loginSchema };
