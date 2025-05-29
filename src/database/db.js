import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})

const connectMongoDB = async() =>{
    try {
        const mongoDB_response = await mongoose.connect(`${process.env.MONGO_DB_CONNECTION_STRING}/blog`)
        console.log(`MongoDB connected sucessfully --> ${mongoDB_response.connection.host}`)
    } catch (error) {
        console.log("error : ", error)
        process.exit(1)
    }
}

export default connectMongoDB