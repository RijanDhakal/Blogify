import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: 'deqzws8sg',
    api_key: '784979772913448',
    api_secret: 'g7xXl49vRKC9hsfQ2G1Li8HcKZs' // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) { return null }
        const cloudinary_response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        // file has been uploaded sucessfully
        // console.log("file is uploaded on cloudinary", cloudinary_response.url)
        fs.unlinkSync(localFilePath)
        // console.log(cloudinary_response)
        return cloudinary_response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporray file as the upload gets failed
        return null;
    }
}

export default uploadOnCloud;
