import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
import dotenv from "dotenv"; // this .env will take your time and then you know you are in wrong directory
dotenv.config({
  path: "./.env",
});

app.set("view engine", "ejs");
app.set("views", path.resolve("src/views"));

// EJS is a server side rendering engine so no cors is needed
import cors from "cors";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser()); // must use to work with verification
app.use(express.static("public")); // this is controversial

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import router
import userRouter from "./routes/user.router.js";
import blogRouter from "./routes/blog.router.js";
import { Blog } from "./models/blog.model.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import mongoose from "mongoose";

//declare route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

app.get("/", async (req, res) => {
  const { page = 1 } = req.query
  const limit = 8
  const blogs = await Blog.aggregate([
    {
      $sort: {
        like: -1,
        createdAt: -1
      }
    },
    {
      $skip: (Number(page) - 1) * Number(limit)
    },
    {
      $limit: Number(limit)
    }
  ])
  if (blogs.length === 0) {
    return res.render("error")
  }
  res.render("home", { blogs })
})

app.get("/admin", verifyJWT, async (req, res) => {
  const { page = 1 } = req.query
  const limit = 8
  const blogs = await Blog.aggregate([
    {
      $sort: {
        like: -1,
        createdAt: -1
      }
    },
    {
      $skip: (Number(page) - 1) * Number(limit)
    },
    {
      $limit: Number(limit)
    }
  ])
  if (blogs.length === 0) {
    return res.render("error")
  }
  res.render("index", {
    blogs,
    user: req.user
  })
})
app.get("/admin/create", verifyJWT, async (req, res) => {
  return res.render("create")
})
app.get("/admin/login", async (req, res) => {
  return res.render("login")
})

app.get("/admin/delete", verifyJWT, async (req, res) => {
  const { page = 1 } = req.query
  const limit = 8
  const blogs = await Blog.aggregate([
    {
      $match:{
        creator : new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $sort: {
        like: -1,
        createdAt: -1
      }
    },
    {
      $skip: (Number(page) - 1) * Number(limit)
    },
    {
      $limit: Number(limit)
    }
  ])
  if (blogs.length === 0) {
    return res.render("error")
  }
  res.render("delete", {
    blogs,
    user: req.user
  })
})



export default app;
