import pool from "../database/db.js";

//create category-admin
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const query = "INSERT INTO categories (name) VALUES (?)";
    const [result] = await pool.query(query, [name]);

    res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ 
      message: "Server Error", 
      error: err.message 
    });
  }
};

//get all categories
export const getCategories = async (req, res) => {
  try {
    const query = "SELECT * FROM categories";
    const [data] = await pool.query(query, []);
    res.json(data);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

//get single category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM categories WHERE id = ?";
    const [data] = await pool.query(query, [id]);
    if (data.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.json(data[0]);
  } catch (err) {
    console.error("Get category by ID error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

//update category-admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }
    const query = "UPDATE categories SET name = ? WHERE id = ?";
    const [data] = await pool.query(query, [name, id]);

    if (data.affectedRows === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.json({
      message: "Category updated successfully",
    });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

//delete category -admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM categories WHERE id = ?";
    const [data] = await pool.query(query, [id]);

    if (data.affectedRows === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
