import express from "express";
import {
  registration,
  login,
  profile,
  logout,
} from "../controller/authController.js";
import {
  registrationValidation,
  loginValidation,
  validationError,
} from "../utils/authValidate.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/verifyToken.js";
import { refreshAccessToken } from "../utils/token.js";
const router = express.Router();

router.post("/register", registrationValidation, validationError, registration);
router.post("/login", loginValidation, validationError, login);
router.get("/profile", verifyAccessToken, profile);
router.get("/refresh-access", verifyRefreshToken, refreshAccessToken);
router.get("/logout", logout);

export default router;
