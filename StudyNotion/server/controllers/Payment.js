const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const { instance } = require("../config/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/nodemailer");


exports.capturePayment = async(req, res) => {

    // data fetch
    const courseId = req.body;
    const userId = req.user.id;
    // Validate
    if(!courseId)
    {
        return res.status(404).json({
            success : false,
            message : "Course Id not Found."
        })
    }

    let courseDetails;
    try{
        // Data find corresponding to given course Id
        courseDetails = await Course.findById(courseId);
        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Course doesn't for given Id."
            })
        }
        // Is user already registered in given course?
        const uId = new mongoose.ObjectId(userId);
        if(courseDetails.studentsEnrolled.includes(uId)){
            return res.status(400).json({
                success : false,
                message : "User already registered in Given Course."
            })
        }
    }
    catch(err){
        return res.status(500).json({
            success : false,
            error : err,
            message : "Failed to interact with DataBase."
        })
    }

    const amount = courseDetails.price;
    const currency = "INR";

    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes : {
            courseId,
            userId
        }
    }
    
    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success : true,
            orderId : paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount,
            courseName : courseDetails.courseName,
            courseDescription : courseDetails.description,
            thumbnail : courseDetails.thumbnail,
            message : "Order Created Successfully."
        })
    }
    catch(err){
        res.json({
            success:false,
            error : err,
            message:"Could not initiate order",
        });
    }
}


exports.verifySignature = async(req, res) => {
    const webHook = process.env.RAZORPAY_HOOK;

    const signature = req.header["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webHook);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(digest === signature)
    {
        console.log("Your Payment is authorized");
        // fulfill action after payment authorization.
        try{
            const {courseId, userId} = req.body.payload.payment.entity.notes;
            const updateCourse = await Course.findByIdAndUpdate({courseId},
                {
                    $push : {studentsEnrolled : userId}
                },
                {new : true}
            )

            if(!updateCourse){
                return res.status(500).json({
                    success : false,
                    message : "Course Details not found."
                })
            }

            const updateUser = await User.findByIdAndUpdate({userId},
                {
                    $push : {courses : courseId}
                },
                {
                    new : true
                }
            )

            const mailResponse = await mailSender(updateUser.email,  "Congratulations from studyNotion",
                "Congratulations, you are onboarded into new studyNotion Course",);

            console.log(mailResponse);
            
            res.status(200).json({
                success : true,
                updateCourse,
                updateUser,
                message : "Signature verified and course added."
            })
        }
        catch(err){
            return res.status(400).json({
                success:false,
                error : err,
                message:'Invalid request',
            });
        }
    }
}