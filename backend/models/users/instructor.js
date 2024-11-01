const mongoose = require("mongoose");
const User = require("./user");
const options = { discriminatorKey: "kind" };

// Create the Instructor schema separately
const InstructorSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    ratings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "rating",
        default: [],
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    miniBiography: {
      type: String,
      default: "",
    },
    cv: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

InstructorSchema.virtual("ratingsCount").get(function () {
  return Array.isArray(this.ratings) ? this.ratings.length : 0;
});

const Instructor = User.discriminator("Instructor", InstructorSchema, options);

module.exports = Instructor;
