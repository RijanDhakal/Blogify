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
// import cors from "cors";
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(cookieParser()); // must use to work with verification
app.use(express.static("public")); // this is controversial

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import router
import userRouter from "./routes/user.router.js";
import blogRouter from "./routes/blog.router.js";
import { Blog } from "./models/blog.model.js";

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
  res.render("index", { blogs })
})

export default app;
