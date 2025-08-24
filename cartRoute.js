import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controller/cartController.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";

const router = express.Router();

// All cart routes require user login
router.post("/", verifyAccessToken, addToCart);
router.get("/", verifyAccessToken, getCart);
router.put("/:cart_id", verifyAccessToken, updateCartItem);
router.delete("/:cart_id", verifyAccessToken, removeCartItem);
router.delete("/", verifyAccessToken, clearCart);

export default router;
