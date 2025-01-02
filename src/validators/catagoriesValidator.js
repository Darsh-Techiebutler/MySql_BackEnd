import * as yup from "yup";

// Define the category validation schema using yup
export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name can't be more than 50 characters"),
});
