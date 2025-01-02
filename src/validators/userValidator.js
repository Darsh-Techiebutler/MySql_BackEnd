import * as yup from "yup";
const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username should have at least 3 characters")
    .max(100, "Username should not exceed 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email should not exceed 100 characters"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters")
    .max(255, "Password should not exceed 255 characters"),

  role: yup
    .string()
    .oneOf(["admin", "superadmin", "user"], "Invalid role")
    .default("user")
    .optional(),
});

// Wrap the schema in an array validation
// const registrationSchema = yup.array().of(usersSchema);

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup.string().required("Password is required"),
});

export { registrationSchema, loginSchema };
