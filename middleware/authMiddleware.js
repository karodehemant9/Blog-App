const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../util/database");
require("dotenv").config();
const JWT_SECRET = process.env.ENCRYPTION_KEY;

const authenticateUser = async (req, res, next) => {
  let connection;

  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required", success: false });
    }


    const user = jwt.verify(token, JWT_SECRET);
    connection = await db.getConnection();
    const query = `SELECT * FROM user WHERE email = ?`;
    const [rows] = await connection.execute(query, [user.email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    req.user = rows[0];
    next();

  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  } 
  finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  authenticateUser
};
