import { Router } from "express"
import { createBlog, deleteBlog, getBlog, updateBlog } from "../controllers/blog.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.use(verifyJWT)

router.route("/create").post(upload.fields([{
    name: "thumbnail",
    maxCount: 1
}]
), createBlog)


router.route("/update").patch(updateBlog)
router.route("/delete").delete(deleteBlog)



export default router
