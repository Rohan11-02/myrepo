const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/payment");
const courseRoutes = require("./routes/course");
const profileRoutes = require("./routes/profile");


const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dataBase");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}));
app.use(cookieParser());

app.use(cors({
    origin : "http://localhost:3000",
    credentials : true,
}))

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);

dbConnect();
cloudinaryConnect();


app.get("/", (req, res)=>{
    res.send("Your server is up and running....")
})

app.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}.`)
})