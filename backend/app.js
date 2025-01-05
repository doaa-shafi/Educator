require("dotenv").config();
const { PORT, MONGO_URI } = require("./config/configVariables");
const { ApiError } = require("./helpers/errors");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

// Route imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const corporateRoutes = require("./routes/corporate");
const corporateTraineeRoutes = require("./routes/corporateTrainee");
const individualTraineeRoutes = require("./routes/individualTrainee");
const instructorRoutes = require("./routes/instructor");
const courseRoutes = require("./routes/course");
const categoryRoutes = require("./routes/category");
const lessonRoutes = require("./routes/lesson");
const enrollmentRoutes = require("./routes/enrollment");
const paymentRoutes = require("./routes/payment");
const stripeRoutes = require("./routes/stripe");
const errorHandler = require("./middlewares/errorHandler");

// Express app
const app = express();

// const corsOptions = {
//   origin: "http://educatorplatform.com", // Update to your client's origin
//   credentials: true, // This allows the server to accept credentials
// };

// app.use(cors(corsOptions));

// Middleware for serving static files
app.use(
  "/docs/certificates",
  express.static(path.join(__dirname, "/docs/certificates"))
);
app.use("/docs/lectures", express.static(path.join(__dirname, "/docs/lectures")));
app.use("/docs/cv", express.static(path.join(__dirname, "/docs/cv")));
app.use(
  "/docs/instructors",
  express.static(path.join(__dirname, "/docs/instructors"))
);

// **Register the Stripe Webhook Route First**
app.use("/webhook", stripeRoutes);

// Global middleware (applied after /webhook route)
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded body
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/admins", adminRoutes);
app.use("/corporates", corporateRoutes);
app.use("/corporateTrainees", corporateTraineeRoutes);
app.use("/individualTrainees", individualTraineeRoutes);
app.use("/instructors", instructorRoutes);
app.use("/courses", courseRoutes);
app.use("/categories", categoryRoutes);
app.use("/lessons", lessonRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/payments", paymentRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
  next(new ApiError(`${req.originalUrl} Not Found`));
});

// Error-handling middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to db & listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
