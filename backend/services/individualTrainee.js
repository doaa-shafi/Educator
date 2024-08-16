const IndividualTrainee = require("../models/users/individualTrainee");
const Course=require('../models/courses/course')
const Instructor=require('../models/users/instructor')
const Payment=require('../models/other/payment')
const enrollmentService=require('../services/enrollment')
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_S_KEY); 


class individualTraineeService {
  async registerToCourse(traineeId, courseId, token) {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start the transaction

    try {
      // Step 1: Add the enrollment
      const enrollment = await enrollmentService.addEnrollment(
        traineeId,
        courseId
      );

      // Step 2: Process the payment
      await this.pay(courseId, traineeId, token, session); // Pass the session

      // Step 3: Update the trainee's enrollments
      const updatedTrainee = await IndividualTrainee.findByIdAndUpdate(
        traineeId,
        {
          $push: { enrollments: enrollment._id }, // Store the enrollment ID
        },
        { new: true, session } // Pass the session
      );

      // Commit the transaction if everything is successful
      await session.commitTransaction();
      session.endSession();

      return updatedTrainee;
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();

      console.error("Error registering to course:", error.message);
      throw error; // Rethrow the error
    }
  }

  //pay for a course
  async pay(courseId, traineeId, token, session) {
    const course = await Course.findById(courseId).session(session); // Use session
    const trainee = await IndividualTrainee.findById(traineeId).session(
      session
    ); // Use session
    const wallet = trainee.wallet;
    const price = course.price;
    const instructor = course.instructor;

    await Instructor.findByIdAndUpdate(instructor, {
      $inc: { wallet: 0.7 * price },
    }).session(session); // Use session

    if (wallet === 0) {
      const charge = await stripe.charges.create({
        amount: price * 100, // Stripe expects the amount in cents
        currency: "usd",
        description: "Course payment",
        source: token.id,
      });

      await Payment.create(
        [
          {
            userId: traineeId,
            courseId: courseId,
            amount: price,
            paymentId: charge.id,
          },
        ],
        { session }
      );
    } else if (wallet >= price) {
      await IndividualTrainee.findByIdAndUpdate(
        traineeId,
        {
          wallet: wallet - price,
        },
        { session }
      );

      await Payment.create(
        [
          {
            userId: traineeId,
            courseId: courseId,
            amount: price,
          },
        ],
        { session }
      );
    } else {
      const newPrice = price - wallet;
      const charge = await stripe.charges.create({
        amount: newPrice * 100, // Stripe expects the amount in cents
        currency: "usd",
        description: "Course payment",
        source: token.id,
      });

      await IndividualTrainee.findByIdAndUpdate(
        traineeId,
        {
          wallet: 0,
        },
        { session }
      );

      await Payment.create(
        [
          {
            userId: traineeId,
            courseId: courseId,
            amount: newPrice,
            paymentId: charge.id,
          },
        ],
        { session }
      );
    }
  }
}

module.exports = new individualTraineeService();
