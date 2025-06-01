import app from "./app.js";
import connectMongoDB from "./database/db.js";
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'public', 'temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}


connectMongoDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("error : ", error)
        })
        app.listen(process.env.PORT, () => {
            console.log("Server is listeining on port number ", process.env.PORT)
        })
    })
    .catch(() => {
        console.log("MongoDB connection failed ")
    })