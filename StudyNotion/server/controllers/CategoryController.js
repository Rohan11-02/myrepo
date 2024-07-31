const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async(req, res) => {
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(404).json({
                success : false,
                message : "All fields are Mandatory."
            })
        }

        const newCategory = await Category.create({name, description});

        res.status(200).json({
            success : true,
            newCategory,
            message : "New Category created Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issues in Creating Category."
        })
    }
}


exports.showAllCategories = async(req, res) => {
    try{
        const allCategories = await Category.find({},
            {
                name : true,
                description : true,
            }
        )
        res.status(200).json({
            success : true,
            allCategories,
            message : "All Categories fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issues in fetching Categories."
        })
    }
}


// categoryPageDetails
exports.categoryPageDetails = async(req, res) => {
    try{
        // find courses for given category
        const {categoryId} = req.body;
        if(!categoryId){
            return res.status(404).json({
                success : false,
                message : "Course Category Not found."
            })
        }

        const selectedCategory = await Category.findById(categoryId)
                                                .populate("courses").exec();

        if(!selectedCategory){
            return res.status(404).json({
                success : false,
                message : "Data For selected Category not Found."
            })
        }
        // courses who category is different
        const differentCategories = await Category.find({_id : {$ne : categoryId}})
                                                        .populate("courses").exec();
    
        // top selling Courses
        const topSellingCourses = await Course.find({})
                                    .sort({studentsEnrolled : -1}).limit(10).exec();
  
        res.status(200).json({
            success : true,
            selectedCategory,
            differentCategories,
            topSellingCourses,
            message : "Category Page Details Fetched Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to get Category Page Details."
        })
    }   
}