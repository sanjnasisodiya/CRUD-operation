import pool from "../database/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

dotenv.config();
//register user/admin
export const registration = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const query = "select*from users where email =?";
    const [user] = await pool.query(query, [email]);
    if (user.length > 0) {
      return res
        .status(200)
        .json({ message: "User already exist try another email" });
    }
    const saltRounds = parseInt(process.env.SALTROUNDS);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const insertQuery = "insert into users(name,email,password) values (?,?,?)";

    const [result] = await pool.query(insertQuery, [name, email, passwordHash]);
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Error during registration ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//login user/admin
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = "select*from users where email =?";
    const [user] = await pool.query(query, [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
    };
    //generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    //set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      maxAge: 8 * 24 * 60 * 60 * 1000,
    });

    //send token in response

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get profile
export const profile = (req, res) => {
  const user = req.user;
  console.log("profile user :", user);
  res.status(200).json({
    message: "Welcome user",
    data: user,
  });
};

//logout user
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "Logout successful",
  });
};


