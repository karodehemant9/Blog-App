const express = require("express");
const db = require("../util/database");

const getPosts = async (req, res) => {
  const userId = req.user.id;
  let connection;

  try {
    connection = await db.getConnection();

    const sql = `
        SELECT p.*, GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS tags
        FROM post p
        LEFT JOIN post_tag pt 
        ON p.id = pt.post_id
        LEFT JOIN tag t 
        ON pt.tag_id = t.id
        WHERE p.userId = ?
        GROUP BY p.id
      `;

    const [results] = await connection.query(sql, [userId]);
    connection.release();
    res.status(200).json({ posts: results });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const createPost = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const userId = req.user.id;

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const post = { title, content, userId };
    const insertPostSql = "INSERT INTO post SET ?";
    const [postInsertResult] = await connection.query(insertPostSql, post);
    const postId = postInsertResult.insertId;

    const placeholders = tags.map(() => "?").join(", ");
    const query = `SELECT id FROM tag WHERE tag_name IN (${placeholders})`;
    const [ids] = await connection.execute(query, tags);

    const tagIds = ids.map((tag) => tag.id);
    const postTagValues = tagIds.map((tagId) => [postId, tagId]);
    const insertPostTagsSql = "INSERT INTO post_tag (post_id, tag_id) VALUES ?";
    await connection.query(insertPostTagsSql, [postTagValues]);

    await connection.commit();
    res.status(201).json({ message: "Post created successfully", postId });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Database error", error: "Failed to fetch post" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getPostById = async (req, res, next) => {
  const postId = req.params.id;
  let connection;

  try {
    connection = await db.getConnection();
    const sql = `
    SELECT p.*, GROUP_CONCAT(t.tag_name) AS tags
    FROM post p 
    LEFT JOIN post_tag pt ON p.id = pt.post_id
    LEFT JOIN tag t ON pt.tag_id = t.id
    WHERE p.id = ? 
    `;

    const [results] = await connection.query(sql, [postId]);
    if (results[0].id === null) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = {
      id: results[0].id,
      title: results[0].title,
      content: results[0].content,
      userId: results[0].userId,
      tags: results[0].tags ? results[0].tags.split(",") : [],
    };

    res.status(200).json({ post });
  } 
  catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  } 
  finally {
    if (connection) {
      connection.release();
    }
  }
};

const updatePostById = async (req, res) => {
  const postId = req.params.id;
  const { title, content, tags } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const updatePostQuery = `UPDATE Post SET title = ?, content = ? WHERE id = ?`;
    await connection.query(updatePostQuery, [title, content, postId]);

    const deletePostTagQuery = `DELETE FROM post_tag WHERE post_id = ?`;
    await connection.query(deletePostTagQuery, [postId]);

    await connection.commit();
    res.status(200).json({ message: "Post updated successfully" });
  } 
  catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post" });
  }
  finally {
    if (connection) {
      connection.release();
    }
  }
};

const deletePostById = async (req, res) => {
  const postId = req.params.id;
  let connection;

  try {
    connection = await db.getConnection();

    await connection.beginTransaction();

    const deletePostTagQuery = "DELETE FROM post_tag WHERE post_id = ?";
    await connection.query(deletePostTagQuery, [postId]);

    const deletePostQuery = "DELETE FROM Post WHERE id = ?";
    await connection.query(deletePostQuery, [postId]);

    await connection.commit();
    res.status(200).json({ message: "Post deleted successfully" });
  } 
  catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
  finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
};
