import * as yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const postValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(255, "Title must be less than 255 characters"),
  content: yup.string().required("Content is required"),
  category_id: yup
    .number()
    .required("Category ID is required")
    .positive("Category ID must be positive"),
  // image: yup
  //   .mixed()
  //   // .required("Image is required")
  //   .test(
  //     "fileFormat",
  //     "Unsupported Format",
  //     value => value && SUPPORTED_FORMATS.includes(value.type)
  //   ),
});
export { postValidationSchema };
