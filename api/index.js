const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "123456qwerg";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://superblogger:ALCh7gbI5P04fq1m@cluster0.hjtdf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "username not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json({ error: "incorrect password" });
    }

    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        console.error("JWT signing error:", err);
        return res.status(500).json({ error: "Failed to generate token" });
      }
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Profile route
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).json("No token provided");
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json("Unauthorized");
    res.json(info);
  });
});

// Logout route
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Logged out");
});

// Post creation route
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json({ postDoc });
  });
});

// Fetch all posts
app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Fetch a single post by ID
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    if (!postDoc) return res.status(404).json({ error: "Post not found" });
    res.json(postDoc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Update a Post (PUT route)
app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    try {
      const postDoc = await Post.findById(id);
      if (!postDoc || String(postDoc.author) !== String(info.id)) {
        return res.status(403).json("Not authorized to update this post");
      }

      const { title, summary, content } = req.body;
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;

      if (req.file) {
        const { originalname, path } = req.file;
        const ext = originalname.split(".").pop();
        const newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
        postDoc.cover = newPath; // Update the cover image with the new file
      }

      await postDoc.save();
      res.json(postDoc); // Return the updated post as a response
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
});

// Delete a post
app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    const postDoc = await Post.findById(id);

    if (!postDoc || JSON.stringify(postDoc.author) !== JSON.stringify(info.id)) {
      return res.status(403).json("Not authorized to delete this post");
    }

    await postDoc.deleteOne();
    res.json("Post deleted successfully");
  });
});

// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
