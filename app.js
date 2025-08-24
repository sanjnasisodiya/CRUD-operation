import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import categoryRouter from "./routes/categoriesRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import otpRouter from "./routes/otpRoute.js";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(helmet());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Routes or api
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
