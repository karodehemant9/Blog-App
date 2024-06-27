const express = require("express");
const db = require("../util/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ENCRYPTION_KEY;

const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    const query = `SELECT * FROM user WHERE email = ?`;
    const [rows] = await connection.execute(query, [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error hashing password", error: err.message });
    }

    const inserQuery = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
    await connection.execute(inserQuery, [name, email, hashedPassword]);

    connection.release();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    const query = `SELECT * FROM user WHERE email = ?`;
    const [rows] = await connection.execute(query, [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ email }, JWT_SECRET);
    res.status(200).json({ message: "Logged in successfully", token });
  } 
  catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  } 
  finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  signupUser,
  loginUser,
};
