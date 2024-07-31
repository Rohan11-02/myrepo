const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { deleteFileFromCloudinary } = require("../utils/deleteFile");
const { uploadFilesToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

// create Subsection
exports.createSubSection = async(req, res) => {
    try{
        const {title, description, sectionId} = req.body;
        const video = req.files.videoFile;

        if(!title || !description || !sectionId || !video){
            return res.status(404).json({
                success : false,
                message : "Every Field is Mandatory."
            })
        }

        const uploadedVideo = await uploadFilesToCloudinary(video, process.env.FOLDER_NAME);
        console.log("Video Uploaded to Cloudinary Successfully :", uploadedVideo);
        
        const newSubSection = await SubSection.create({
            title,
            description,
            timeDuration : `${uploadedVideo.duration}`,
            videoUrl : uploadedVideo.secure_url,
            publicId : uploadedVideo.public_id,
        })

        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push : {subSection : newSubSection._id}
            },
            {new : true}
        ).populate("subSection").exec();

        res.status(200).json({
            success : true,
            updatedSection,
            message : "New SubSection Created Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issue in Creating SubSection"
        })
    }
}

// update SubSection
exports.updateSubSection = async(req, res) => {
    try{
        const {title, description, subSectionId} = req.body;
        const video = req.files.videoFile;

        if(!title || !description || !video || !subSectionId){
            return res.status(404).json({
                success : false,
                message : "All Fields are Mandatory."
            })
        }
        // How to delete initially uploaded video from Cloudinary?
        const subSectionDetails = await SubSection.findById(subSectionId);
        const publicId = subSectionDetails.publicId;
        console.log(publicId);
        await deleteFileFromCloudinary(publicId, "video");

        const uploadedVideo = await uploadFilesToCloudinary(video, process.env.FOLDER_NAME);        
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId,
            {
                title : title,
                description : description,
                timeDuration : `${uploadedVideo.duration}`,
                videoUrl : uploadedVideo.secure_url,
            }
        )
        res.status(200).json({
            success : true,
            updatedSubSection,
            message : "SubSection Updated Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issue in Updating SubSection"
        })
    }
}

// delete SubSection
exports.deleteSubSection = async(req, res) => {
    try{
        const {sectionId, subSectionId} = req.body;

        if(!sectionId || !subSectionId){
            return res.status(404).json({
                success : false,
                message : "All Fields are Mandatory."
            })
        }
        const subSectionDetails = await SubSection.findById(subSectionId);
        const publicId = subSectionDetails.publicId;
        await deleteFileFromCloudinary(publicId, "video");
        
        await SubSection.findByIdAndDelete(subSectionId);
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $pull : {subSection : subSectionId}
            },
            {new : true}
        )
        res.status(200).json({
            success : true,
            updatedSection,
            message : "Sub Section Deleted Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issue in Deleting SubSection"
        })
    }
}