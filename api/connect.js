import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectTimeout: 20000,
  connectionLimit: 10, // Adjust as per your requirements
  queueLimit: 0, // Unlimited queueing
});
