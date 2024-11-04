const Corporate = require("../models/users/corporate");
const Course = require("../models/courses/course");
const User = require("../models/users/user");
const Instructor = require("../models/users/instructor");
const Payment = require("../models/other/payment");
const courseService = require("./course");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);
const mongoose = require("mongoose");

class corporateService {
  async getCorporateById(corporateId) {
    return await Corporate.findById(corporateId);
  }
  async addCorporate(username, email, password, plan, paymentMethodId) {
    const foundEmail = await User.findOne({ email }).exec();
    if (foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await stripe.customers.create({
      email,
      name: username,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Define Price IDs for different plans
    const priceId =
      plan === "Standard"
        ? process.env.STRIPE_PRICE_STANDARD
        : process.env.STRIPE_PRICE_PREMIUM;

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    if (paymentIntent.status === "requires_payment_method") {
      throw new Error("Payment failed. Please provide a valid payment method.");
    }
    const newCorporate= await Corporate.create({
      firstName: username,
      lastName: username,
      email,
      password: hashedPassword,
      plan,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      status: "Pending", // Set to pending until payment is confirmed
    });
    return {
      corporate: newCorporate,
      clientSecret: paymentIntent.client_secret // Return client_secret for payment confirmation
  };
  }
  //pay for a course
  async registerToCourse(corporateId, courseId, totalEnrollments, token) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let charge = null;
    try {
      const course = await Course.findById(courseId).session(session); // Use sessio
      const corporate = await Corporate.findById(corporateId).session(session);
      const price = await courseService.getCalculatedPrice(
        courseId,
        totalEnrollments
      );
      const instructor = course.instructor;

      await Instructor.findByIdAndUpdate(instructor, {
        $inc: { wallet: 0.7 * price },
      }).session(session); // Use session

      charge = await stripe.charges.create({
        amount: price * 100, // Stripe expects the amount in cents
        currency: "usd",
        description: "Course payment",
        source: token.id,
      });
      await Payment.create(
        [
          {
            payerId: corporateId,
            receiverId: course.instructor,
            courseId: courseId,
            amount: price * 0.7,
            paymentId: charge.id,
          },
        ],
        { session }
      );
      corporate.courses.push({
        id: course._id,
        title: course.title,
        totalEnrollments,
        currentEnrollments: 0,
      });
      await corporate.save({ session });
      await session.commitTransaction();
      session.endSession();
      return corporate;
    } catch (error) {
      if (charge !== null) {
        await stripe.refunds.create({ charge: charge.id });
      }
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new corporateService();
