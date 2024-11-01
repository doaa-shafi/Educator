const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    payerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    amount: {
        type:Number
    },
    paymentId: {
        type:String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
