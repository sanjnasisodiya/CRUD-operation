import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { verifyAccessToken, verifyRole } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/", verifyAccessToken, verifyRole("admin"), createProduct);
router.put("/:id", verifyAccessToken, verifyRole("admin"), updateProduct);
router.delete("/:id", verifyAccessToken, verifyRole("admin"), deleteProduct);

export default router;
