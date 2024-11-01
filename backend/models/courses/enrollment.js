const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    trainee: {
      type: mongoose.Types.ObjectId,
      ref: "Trainee",
    },
    myRating: {
      rating: {
        type: Number,
      },
      review: {
        type: String,
      },
    },
    completedDuration: {
      type: Number,
      default: 0, 
    },
    totalDuration: {
      type: Number,
      default: 0, // Total duration of all items
    },
    certificate: {
      type: String,
    },
    done: {
      type: Boolean,
      default: false,
    },
    lessons: {
      type: [
        {
          lessonID: {
            type: mongoose.Types.ObjectId,
            ref: "Lesson",
          },
          items: {
            type: [
              {
                done: {
                  type: Boolean,
                  default: false,
                },
                duration: {
                  type: Number,
                },
              },
            ],
          },
          notes: {
            type: String,
            default: "",
          },
          quiz: {
            passed: {
              type: Boolean,
            },
            grade: {
              type: Number,
            },
            answers: {
              type: [String],
            },
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
