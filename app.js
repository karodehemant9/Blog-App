const express = require("express");

const userRoutes = require("./routes/userRouter");
const postRoutes = require("./routes/postRouter");
const tagRoutes = require("./routes/tagRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
const PORT = process.env.PORT || 3000;

app.use("/", userRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagRoutes);
app.use("*", (req, res, next) => {
  return res.status(404).json({message: "resource not found"});
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
