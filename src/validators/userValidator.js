import * as yup from "yup";
const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username should have at least 3 characters")
    .max(100, "Username should not exceed 100 characters"), // Added max length for username

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email should not exceed 100 characters"), // Added max length for email

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters")
    .max(255, "Password should not exceed 255 characters"), // Added max length for password

  role: yup
    .string()
    .oneOf(["admin", "superadmin", "user"], "Invalid role")
    .default("user") // Default role is "user"
    .optional(), // Role is optional if it's not explicitly passed in the request
});


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup.string().required("Password is required"),
});

export { registrationSchema, loginSchema };
