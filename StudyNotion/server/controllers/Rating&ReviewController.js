const Course = require("../models/Course");
const mongoose = require("mongoose");
const RatingAndReview = require("../models/RatingAndReview");


// create Rating&Review
exports.createRatingAndReview = async(req, res) => {
    try{
        // user
        const userId = req.user.id; 
        // courseId 
        const {courseId, rating, review} = req.body;
        // validate courseId
        if(!courseId){
            res.status(404).json({
                success : false,
                message : "courseId not found."
            })
        }
        // student is enrolled or not
// Method - 1        
        // const courseDetails = await Course.findById(courseId);

        // const uId = new mongoose.ObjectId(userId);
        // if(!courseDetails.studentsEnrolled.includes(uId)){
            // return res.status(401).json({
            //     success : false,
            //     message : "You are not enrolled in Course."
            // })
        // }

// Method -2
        const enrolledStudent = await Course.findOne({
            _id : courseId,
            studentsEnrolled : {
                $elemMatch : {
                    $eq : userId
                }
            }
        })

        if(!enrolledStudent){
            return res.status(401).json({
                success : false,
                message : "You are not enrolled in Course."
            })
        }

        // check if user haven't rated or reviewed.
        const alreadyRated_Reviewed = await RatingAndReview.findOne ({courseId, userId});
        if(alreadyRated_Reviewed){
            return res.status(400).json({
                success : false,
                message : "You have already Rated and Reviewed the course."
            })
        }
        
        // create rating and review
        const rating_Review = await RatingAndReview.create({
            rating,
            review,
            userId,
            courseId
        })
        // update Course 
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push : {ratingAndReview : rating_Review._id}
            },
            {
                new : true
            }
        )
        res.status(200).json({
            success : true,
            updatedCourse,
            message : "Course Rated and Reviewed Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to add your Rating and Review to this Course."
        })
    }
}


// getAverageRating
exports.getAverageRating = async(req, res) => {
    try{
        const {courseId} = req.body;

        const result = await RatingAndReview.aggregate([
            {
                $match : {
                    courseId : new mongoose.ObjectId(courseId)
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {
                        $avg : "$rating"
                    }
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,
                message : `Average Rating is ${averageRating}.`
            })
        }
        
        return res.status(200).json({
            success : true,
            averageRating : 0,
            message : "Average Rating is 0, no ratings given till now"
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err, 
            message : "Failed to get Average Rating."
        })
    }
}


// getAllRating&Review
exports.getAllRatingAndReview = async(req, res) => {
    try{
        const rating_Review = await RatingAndReview.find({})
                                                .sort({rating : "desc"})
                                                .populate({
                                                    path : "user",
                                                    select : "fName lName email image"
                                                })
                                                .populate({
                                                    path : "courseId",
                                                    select : "courseName"
                                                })
                                                .exec();
        if(rating_Review.length === 0){
            return res.status(404).json({
                success : false,
                message : "No Rating and Review Available."
            })
        }
        res.status(200).json({
            success : true,
            rating_Review,
            message : "Rating and Reviews fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to get Rating and Reviews"
        })
    }
}


// getCourseRating&Review
exports.getCourseRatingAndReview = async(req, res) => {
    try{
        // courseId
        const {courseId} = req.body;
        // findById
        const courseRating_Review = await RatingAndReview.find({courseId})
                                                        .sort({rating : "desc"})
                                                        .populate({
                                                            path : "user",
                                                            select : "fName lName email image"
                                                        })
                                                        .populate({
                                                            path : "courseId",
                                                            select : "courseName"
                                                        })
                                                        .exec();
        if(courseRating_Review.length === 0){
            return res.status(404).json({
                success : false,
                message : "No Rating and Review Available for the Course",
            })
        }
        // return response
        res.status(200).json({
            success : true,
            courseRating_Review,
            message : "Rating and Reviews fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to get Rating and Reviews for Course."
        })
    }
}