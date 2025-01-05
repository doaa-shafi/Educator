const IndividualTrainee = require("../models/users/individualTrainee");
const Course = require("../models/courses/course");
const Instructor = require("../models/users/instructor");
const Payment = require("../models/other/payment");
const enrollmentService = require("../services/enrollment");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);

class individualTraineeService {
  async registerToCourse(traineeId, courseId, paymentMethodId) {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start the transaction

    let paymentIntent = null;

    try {
      // Step 1: Add the enrollment
      const enrollment = await enrollmentService.addEnrollment(
        traineeId,
        courseId,
        session
      );

      // Step 2: Update the trainee's enrollments
      const updatedTrainee = await IndividualTrainee.findByIdAndUpdate(
        traineeId,
        {
          $push: { enrollments: enrollment._id }, // Store the enrollment ID
        },
        { new: true, session } // Pass the session
      );

      // Step 3: Process the payment
      paymentIntent = await this.pay(
        courseId,
        traineeId,
        paymentMethodId,
        session
      );

      // Commit the transaction if everything is successful
      await session.commitTransaction();
      session.endSession();

      return updatedTrainee;
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();

      // Refund the payment if it was processed
      if (paymentIntent && paymentIntent.status === "succeeded") {
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: "requested_by_customer",
        });
      }

      throw error; // Rethrow the error
    }
  }

  //pay for a course
  async pay(courseId, traineeId, paymentMethodId, session) {
    let paymentIntent = null;

    try {
      const course = await Course.findById(courseId).session(session); // Use session
      const trainee = await IndividualTrainee.findById(traineeId).session(
        session
      );
      const wallet = trainee.wallet;
      const price = course.price;
      const instructor = course.instructor;

      if (wallet >= price) {
        // Pay fully from wallet
        await IndividualTrainee.findByIdAndUpdate(
          traineeId,
          { wallet: wallet - price },
          { session }
        );

        await Payment.create(
          [
            {
              payerId: traineeId,
              receiverId: instructor,
              courseId: courseId,
              amount: price * 0.7,
            },
          ],
          { session }
        );
      } else {
        // Partial wallet + payment intent
        const remainingAmount = price - wallet;

        if (wallet > 0) {
          await IndividualTrainee.findByIdAndUpdate(
            traineeId,
            { wallet: 0 },
            { session }
          );
        }

        // Create a payment intent for the remaining amount
        paymentIntent = await stripe.paymentIntents.create({
          amount: remainingAmount * 100, // Convert to cents
          currency: "usd",
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never", // No redirects
          },
        });

        // Log the payment in the database
        await Payment.create(
          [
            {
              payerId: traineeId,
              receiverId: instructor,
              courseId: courseId,
              amount: price * 0.7,
              paymentId: paymentIntent.id,
            },
          ],
          { session }
        );
      }

      return paymentIntent;
    } catch (error) {
      // If any error occurs during the payment, refund if necessary
      if (paymentIntent && paymentIntent.status === "succeeded") {
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: "requested_by_customer",
        });
      }

      throw error;
    }
  }
}

module.exports = new individualTraineeService();
