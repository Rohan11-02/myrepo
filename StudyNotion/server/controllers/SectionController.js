const Section = require("../models/Section");
const Course = require("../models/Course");

// Creating New Section
exports.createSection = async(req, res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(404).json({
                success : false,
                message : "All fields are Mandatory."
            })
        }

        
        const newSection = await Section.create({sectionName});
        const courseDetails = await Course.findByIdAndUpdate({_id: courseId},
            {
                $push : {courseContent : newSection._id}
            },
            {new : true}
        ).populate("courseContent").exec();
    
        res.status(200).json({
            success : true,
            courseDetails,
            newSection,
            message : "New Section Created Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Facing Issues in Creating New Section."
        })
    }
}


// Updating Section
exports.updateSection = async(req, res) =>{
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionId || !sectionName){
            return res.status(404).json({
                success : true,
                message : "All Fields are Mandatory."
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                sectionName,
            },
            {new : true}
        )

        res.status(200).json({
            success : true,
            updatedSection,
            message : "Section updated Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to Update Section."
        })
    }
}

// Delete a Section
exports.deleteSection = async(req, res) => {
    try{
        const {sectionId, courseId} = req.body;

        if(!sectionId || !courseId){
            return res.status(404).json({
                success : false,
                message : "All fields are Mandatory."
            })
        }

        await Section.findByIdAndDelete(sectionId);
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $pull : {courseContent : sectionId}
            },
            {new : true}
        )
        res.status(200).json({
            success : true,
            updatedCourse,
            message : "Section Deleted Successfully."
        })
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to Delete Section."
        })
    }
}