const express = require("express");
const db = require("../util/database");

const getTags = async (req, res) => {
    let connection;
  
    try {
      connection = await db.getConnection();

      const sql = 'SELECT * FROM tag ORDER BY id';
      const [rows] = await connection.query(sql);
      if (rows.length === 0) {
        return res.status(404).json({ message: "No tags found" });
      }
      connection.release();
      res.status(200).json({ tags: rows });
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
    getTags
};

