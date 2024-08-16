const mongoose = require("mongoose");
const Schema=mongoose.Schema
const programSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    courses: [
      {
        courseID: {
          type: mongoose.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema); 
