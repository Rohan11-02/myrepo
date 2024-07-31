const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadFilesToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();


exports.createCourse = async(req, res) => {
    try{
        let {
            courseName,
            description,
            language, 
            whatYouWillLearn,
            price,
            tag,
            categoryId,
            status,
            instructions = ""
        } = req.body;

        const thumbnail = req.files.thumbnailImage;
        
        if(!status || status === undefined){
            status = "Draft"
        }

        if(!courseName || !description || !language || !whatYouWillLearn || !price || !tag || !categoryId || !thumbnail)
        {
            return res.status(404).json({
                success : false,
                message : "Please fill All the Details Carefully."
            })
        }


        const instructor_id = req.user.id;

        // Validate Category
        const validCategory = await Category.findById(categoryId);
        if(!validCategory){
            return res.status(401).json({
                success : false,
                message : "Such Category does not exists."
            })
        }

        const uploadedImage = await uploadFilesToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log("Image Uploaded to Cloudinary Successfully :",uploadedImage);

        const newCourse = await Course.create({
            courseName,
            description,
            language,
            whatYouWillLearn,
            price,
            tag,
            instructor : instructor_id,
            category : validCategory._id,
            thumbnail : uploadedImage.secure_url,
            status,
            instructions
        });

        const updatedInstructor = await User.findByIdAndUpdate(instructor_id,
            {
                $push : {courses : newCourse._id}
            },
            {new : true}
        )

        
        const updatedCategory = await Category.findByIdAndUpdate({_id : validCategory._id},
            {
                $push : {courses : newCourse._id}
            },
            {new : true}
        )

        res.status(200).json({
            success : true,
            updatedInstructor,
            updatedCategory,
            newCourse,
            message : "New Course Created Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issues in Creating new Courses."
        })
    }
}


exports.getAllCourses = async(req, res) => {
    try{
        const allCourses = await Course.find({},
            {
                courseName : true,
                description : true,
                instructor : true,
                language : true,
                whatYouWillLearn : true,
                thumbnail : true,
                price : true,
                tag : true,
                category : true
            }
        )
        .populate({
            path : "instructor",
            select : "fName lName email"
        })
        .populate("category")
        .exec();

        res.status(200).json({
            success : true,
            allCourses,
            message : "All Courses fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issues in fetching Courses."
        })
    }
}


// getCourseDetails
exports.getCourseDetails = async(req, res) => {
    try{
        // fetch courseId 
        const {courseId} = req.body;
        // get data and populate
        const courseDetails = await Course.findById(courseId)
                                                .populate({
                                                    path : "instructor",
                                                    select : "fName lName email",
                                                    populate : {
                                                        path : "additionalDetails"
                                                    }
                                                })
                                                .populate("ratingAndReview")
                                                .populate({
                                                    path : "courseContent",
                                                    populate : {
                                                        path : "subSection"
                                                    }
                                                })
                                                .populate("studentsEnrolled")
                                                .populate("category")
        
        return res.status(200).json({
            success : true,
            courseDetails,
            message : "Course Details fetched successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to get Course Details."
        })
    }
}