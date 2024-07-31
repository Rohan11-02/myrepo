const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    displayName : {
        type : String,
    },
    profession : {
        type : String,
    },
    dateOfBirth : {
        type : String,
    },
    gender : {
        type : String, 
    },
    about : {
        type : String,
        trim : true,
    },
    contactNumber: {
        type : String,
        trim : true,
    }
})

module.exports = mongoose.model("Profile", profileSchema);