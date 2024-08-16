const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "course",
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
