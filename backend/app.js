require("dotenv").config();
const { PORT, MONGO_URI } = require("./config/configVariables");
const {ApiError} =require("./helpers/errors")
const mongoose = require("mongoose");
const path = require("path");
const cors=require('cors')
const express = require("express");
const multer = require("multer");
var cookieParser = require("cookie-parser");

//const varifyJWT  = require('./middlewares/verifyJWT');

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const corporateRoutes = require("./routes/corporate");
const teamRoutes =require('./routes/team')
const corporateTraineeRoutes = require("./routes/corporateTrainee");
const individualTraineeRoutes = require("./routes/individualTrainee");
const instructorRoutes = require("./routes/instructor");
const courseRoutes = require("./routes/course");
const categoryRoutes=require('./routes/category')
const lessonRoutes = require("./routes/lesson");
const enrollmentRoutes=require('./routes/enrollment')
const paymentRoutes=require("./routes/payment")
const errorHandler = require("./middlewares/errorHandler");

//express app
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Update to your client's origin
  credentials: true // This allows the server to accept credentials
};

app.use(cors(corsOptions));
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  "/docs/certificates",
  express.static(path.join(__dirname, "/docs/certificates"))
);
app.use(
  "/docs/lectures",
  express.static(path.join(__dirname, "/docs/lectures"))
);
app.use("/docs/cv", express.static(path.join(__dirname, "/docs/cv")));

app.use("/docs/instructors", express.static(path.join(__dirname, "/docs/instructors")));

//routes
app.use("/auth", authRoutes);
app.use("/admins", adminRoutes);
app.use("/corporates", corporateRoutes);
app.use("/teams",teamRoutes)
app.use("/corporateTrainees", corporateTraineeRoutes);
app.use("/individualTrainees", individualTraineeRoutes);
app.use("/instructors", instructorRoutes);
app.use("/courses", courseRoutes);
app.use("/categories",categoryRoutes)
app.use("/lessons", lessonRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/payments", paymentRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`${req.originalUrl} Not Found`));
});

//middleware
app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(PORT, () => {
      console.log("connected to db & listening on port ", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });


