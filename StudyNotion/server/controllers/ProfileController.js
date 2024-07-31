const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadFilesToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

// Update Profile
exports.updateProfile = async(req, res) => {
    try{
        // default parameter
        const {
            displayName, 
            profession = "", 
            dateOfBirth = "", 
            gender, 
            about = "", 
            contactNumber
        } = req.body;

        if(!displayName || !gender || !contactNumber){
            return res.status(404).json({
                success : true,
                message : "Some Fields are Mandatory."
            })
        }

        const userId = req.user.id;
        const userDetails = await User.findById(userId);

        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User Details not Found."
            })
        }
        const profileId = userDetails.additionalDetails;
        // const updatedProfile = await Profile.findByIdAndUpdate({profileId},
        //     {
        //         displayName, 
        //         profession, 
        //         dateOfBirth, 
        //         gender, 
        //         about, 
        //         contactNumber
        //     }, 
        //     {
        //         new : true
        //     }
        // )


        const profileDetails = await Profile.findById(profileId);
        // update profile
        profileDetails.displayName = displayName;
        profileDetails.profession = profession;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        res.status(200).json({
            success : true,
            // updatedProfile,
            profileDetails,
            message : "Profile Updated Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issue in Updating Profile."
        })
    }
}


// Delete Account
exports.deleteAccount = async(req, res) => {
    try{
        const userId = req.user.id;
        const userAccountType = req.user.accountType;

        const userDetails = await User.findById(userId);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User doesnot Exists"
            })
        }
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        if(userAccountType === "Student"){
            await Course.updateMany(
                {
                    studentsEnrolled : userId
                },
                {
                    $pull : {
                        studentsEnrolled : userId
                    }
                },
                {new : true}
            )
        }
        else if(userAccountType === "Instructor"){
            await Course.updateMany(
                {
                    instructor : userId
                },
                {
                    $unset : {
                        instructor : ""
                    }
                },
                {
                    new : true
                }
            )
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        res.status(200).json({
            success : true,
            deletedUser,
            message : "User Account deleted Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to delete User Account."
        })
    }
}


// get User
exports.getUser = async(req, res) => {
    try{
        const userId = req.user.id;
        const userDetails = await User.findById(userId).populate("additionalDetails").exec();

        res.status(200).json({
            success : true,
            userDetails,
            message : "User Details fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to fetch User Details."
        })
    }
}


// updateDisplayPicture
exports.updateDisplayPicture = async(req, res) => {
    try{
        const userId = req.user.id;
        const image = req.files.imageFile;

        if(!image){
            return res.status(404).json({
                success : false,
                message : "Please send image first to change profile picture."
            })
        }

        const uploadImage = await uploadFilesToCloudinary(image, process.env.FOLDER_NAME);
        console.log(uploadImage);

        const updateUser = await User.findByIdAndUpdate(userId,
            {
                image : uploadImage.secure_url,
            },
            {new : true}
        )

        res.status(200).json({
            success : true,
            updateUser,
            message : "User Display Picture Updated Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to update display picture."
        })
    }
}

// getEnrolledCourses
exports.getEnrolledCourses = async(req, res) => {
    try{
        const userId = req.user.id;
        
        const enrolledCourses = await User.findById(userId)
                                        .populate("courses")
                                        .exec();
        
        res.status(200).json({
            success : true,
            enrolledCourses,
            message : "User is Enrolled in Above Courses."
        })                                
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to get enrolled list for User."
        })
    }
}