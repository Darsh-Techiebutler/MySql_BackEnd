import Category from "../models/CategoryModel.js";
import { categorySchema } from "../validators/catagoriesValidator.js"; // Import the schema
import { ValidationError } from "yup";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    // Validate the request body using yup schema
    await categorySchema.validate(req.body, { abortEarly: false });

    const { name, description } = req.body;
    const newCategory = await Category.create({
      name,
      description,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors, // List of validation error messages
      });
    }
    console.log(error);

    res.status(500).json({ error: "Failed to create category" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    // Validate the request body using yup schema
    await categorySchema.validate(req.body, { abortEarly: false });

    const { name, description } = req.body;
    await category.update({ name, description });
    res.json(category);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors, // List of validation error messages
      });
    }
    console.log(error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.query.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to delete category" });
  }
};
