const express = require("express");
const { authN, isStudent } = require("../middlewares/auth");
const { updateProfile, deleteAccount, getUser, updateDisplayPicture, getEnrolledCourses } = require("../controllers/ProfileController");
const router = express.Router();



// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
router.put("/updateProfile", authN, updateProfile);
router.delete("/deleteAccount", authN, deleteAccount);
router.get("/getUser", authN, getUser);
router.put("/updateDisplayPicture", authN, updateDisplayPicture);
router.get("/getEnrolledCourses", authN, isStudent, getEnrolledCourses);


module.exports = router;