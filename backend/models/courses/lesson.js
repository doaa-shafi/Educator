const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "course",
    },
    mins: {
      type: Number,
      default: 0,
    },
    items: [
      {
        title: {
          type: String,
        },
        link: {
          type: String,
        },
        duration: {
          type: Number,
        },
        type:{
          type:Number,
          enum: {
            values: [1, 2],
            message: '{VALUE} is not supported'
          }
        }
      },
    ],
    quiz: [
      {
        question: {
          type: String,
        },
        choiceA: {
          type: String,
        },
        choiceB: {
          type: String,
        },
        choiceC: {
          type: String,
        },
        choiceD: {
          type: String,
        },
        answer: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
