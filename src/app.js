import cors from "cors";
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

//declare route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blog", blogRouter);

app.get("/", async (req, res) => {
    res.render("index")
});


export default app;
