import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  searchBlog,
  // updateBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.use(verifyJWT);

router.route("/create").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createBlog
);

// router.route("/update").patch(verifyJWT,updateBlog);
router.route("/delete").post(verifyJWT ,deleteBlog);
router.route("/getBlog/:blogId").get(getBlog)
router.route("/search").get(searchBlog)

export default router;
