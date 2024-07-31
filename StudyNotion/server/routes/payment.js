const express = require("express");
const { authN, isStudent } = require("../middlewares/auth");
const { capturePayment, verifySignature } = require("../controllers/Payment");
const router = express.Router();


router.post("/capturePayment", authN, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

module.exports = router;