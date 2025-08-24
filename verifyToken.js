import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Verify Access Token
export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    req.user = decoded; // contains id, email, role
    next();
  } catch (err) {
    console.error("Access token verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired access token" });
  }
};

// Verify Refresh Token (for generating new access token)
export const verifyRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Role-based Access Control Middleware
export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
};
