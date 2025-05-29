import mongoose,{Schema} from "mongoose"


const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    creator :{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    like:{
        type : Number,
        default : 0
    },
    thumbnail:{
        type:String,
    }
},{timestamps:true})

export const Blog = mongoose.model("blog",blogSchema)