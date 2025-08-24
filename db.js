import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  //   queueLimit: 0,
});

const createConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Please check your database credentials and connection");
  }
};

createConnection();

export default pool;
