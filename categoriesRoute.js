import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

import { verifyAccessToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);

// Protected routes (admin role)
router.post("/:id", verifyAccessToken, verifyRole("admin"), createCategory);

// Specific ID routes
router.get("/:id", getCategoryById);
router.put("/:id", verifyAccessToken, verifyRole("admin"), updateCategory);
router.delete("/:id", verifyAccessToken, verifyRole("admin"), deleteCategory);

export default router;
