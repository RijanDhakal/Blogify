import { Blog } from "../models/blog.model.js";
import asyncHandeler from "../utilities/asynchandler.js";
import costumeError from "../utilities/costumError.js";
import APIresponse from "../utilities/APIresponse.js";
import mongoose,{isValidObjectId} from "mongoose";
import uploadOnCloud from "../utilities/uploadOncloudinary.js";
import { User } from "../models/user.model.js";

const createBlog = asyncHandeler(async(req,res)=>{
    const {title , description } = req.body
    if(
        [title,description].some((field)=> field?.trim() === "")
    ){
        throw new costumeError(404,"Fileds cannot be empty")
    }
    const thumbnail_file = req.files?.thumbnail[0]?.path
    if(!thumbnail_file){
        throw new costumeError(404,"Thumbnail for blog is needed")
    }
    const thumbnail = await uploadOnCloud(thumbnail_file)
    const user = req.user
    const blog = await Blog.create({
        title:title,
        description:description,
        creator :user._id,
        thumbnail:thumbnail.url
    })
    if(!blog){
        throw new costumeError(500,"New blog cannot be created internal servor error")
    }
    return res
    .status(200)
    .json(
        new APIresponse(200,blog,"Blog created Sucessfully")
    )
})

const updateBlog = asyncHandeler(async(req,res)=>{
    const {blogId , title , description} = req.body
    if(!(title||description)){
        throw new costumeError(400,"No changes made")
    }
    if(!mongoose.isValidObjectId(blogId)){
        throw new costumeError(400,"Invalid Blog id")
    }
    const blog = await Blog.findById(blogId)
    if(!blog){
        throw new costumeError(404,"No blog found")
    }

    if(!(JSON.stringify(blog.creator) == JSON.stringify(req.user._id))){
        throw new costumeError(404,"Unauthorized request , Only owner can edit")
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set:{
                title:title,
                description:description
            }
        },
        {
            new : true
        }
    )
    if(!updatedBlog){
        throw new costumeError(500,"Internal servor error while updating blog")
    }
    return res.status(200)
    .json(
        new APIresponse(200,updatedBlog,"Blog updates sucessfully")
    )
})

const deleteBlog = asyncHandeler(async(req,res)=>{
    const {blogId} = req.body
    if(!mongoose.isValidObjectId(blogId)){
        throw new costumeError(400,"Invalid Blog id")
    }
    const blog = await Blog.findById(blogId)
    if(!blog){
        throw new costumeError(404,"No blog found")
    }

    if(!(JSON.stringify(blog.creator) == JSON.stringify(req.user._id))){
        throw new costumeError(404,"Unauthorized request , Only owner can edit")
    }
    const delete_response = await Blog.findByIdAndDelete(blogId)
    return res.status(200)
    .json(
        new APIresponse(200,delete_response,"Blog deleted sucessfully")
    )
})

const getBlog = asyncHandeler(async(req,res)=>{
    const {blogId} = req.params
    if(!blogId){
        return res.render("error")
    }
    const blog = await Blog.findById(blogId)
    if(!blog){
        return res.render("error")
    }
    const blogOwner = await User.findById(blog.creator)
    return res.render("viewBlog" , {
        blog,
        blogOwner
    })
})

const searchBlog = asyncHandeler(async(req,res)=>{
    const {query} = req.query
    const blogs = await Blog.aggregate([
        {
            $search:{
                index : "default",
                text : {
                    query : query,
                    path : "title",
                }
            }
        },
        {
            $limit:8
        }
    ])
    if(blogs.length === 0){
        return res.render("error")
    }
    res.render("home",{blogs})
})
export {
    updateBlog,
    createBlog,
    deleteBlog,
    getBlog,
    searchBlog
}