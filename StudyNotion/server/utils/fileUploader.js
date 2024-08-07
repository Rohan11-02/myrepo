const cloudinary = require("cloudinary").v2;

exports.uploadFilesToCloudinary = async(file, folder, quality, height) => {
    try{
        const options = {folder};
        if(quality){
            options.quality = quality;
        }
        if(height){
            options.height = height;
        }

        options.resource_type = "auto";

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    }
    catch(err){
        console.log("Failed to upload to Cloudinary.");
        console.log(err);
    }
}