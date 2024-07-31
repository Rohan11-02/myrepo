const express = require("express");
const { authN, isAdmin, isInstructor, isStudent } = require("../middlewares/auth");
const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/CategoryController");
const { createCourse, getAllCourses, getCourseDetails } = require("../controllers/CourseController");
const { createSection, updateSection, deleteSection } = require("../controllers/SectionController");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSectionController");
const { createRatingAndReview, getAverageRating, getAllRatingAndReview } = require("../controllers/Rating&ReviewController");
const router = express.Router();


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin

router.post("/createCategory", authN, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/getCategroyPageDetails", categoryPageDetails);



// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

router.post("/createCourse", authN, isInstructor, createCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails", getCourseDetails);
router.post("/createSection", authN, isInstructor, createSection);
router.put("/updateSection", authN, isInstructor, updateSection);
router.delete("/deleteSection", authN, isInstructor, deleteSection);
router.post("/createSubSection", authN, isInstructor, createSubSection);
router.put("/updateSubSection", authN, isInstructor, updateSubSection);
router.delete("/deleteSubSection", authN, isInstructor, deleteSubSection);



// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRatingAndReview", authN, isStudent, createRatingAndReview);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingAndReview", getAllRatingAndReview);

module.exports = router;