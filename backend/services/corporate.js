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
    console.log(customer.id);
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
    const newCorporate = await Corporate.create({
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
      clientSecret: paymentIntent.client_secret, // Return client_secret for payment confirmation
    };
  }

  async renew(corporateId, paymentMethodId) {
    try {
      // Find the corporate user
      const corporate = await Corporate.findById(corporateId);
      if (!corporate) {
        throw new Error("Corporate user not found.");
      }

      // Retrieve the customer's subscription
      const subscriptionsPastDue = await stripe.subscriptions.list({
        customer: corporate.stripeCustomerId,
        status: "past_due", // Target subscriptions that are overdue
        limit: 1, // Assuming one active subscription per corporate user
      });
      const subscriptionsIncomplete = await stripe.subscriptions.list({
        customer: corporate.stripeCustomerId,
        status: "incomplete", // Target subscriptions that are overdue
        limit: 1, // Assuming one active subscription per corporate user
      });

      if (
        subscriptionsPastDue.data.length === 0 &&
        subscriptionsIncomplete.data.length === 0
      ) {
        throw new Error("No overdue subscription found.");
      }

      let subscription;

      if (subscriptionsPastDue.data.length !== 0) {
        subscription = subscriptionsPastDue.data[0];
      } else {
        subscription = subscriptionsIncomplete.data[0];
      }
      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: corporate.stripeCustomerId,
      });
      // Set the default payment method for future invoices
      await stripe.customers.update(corporate.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      // Retry payment for the latest invoice
      const invoice = await stripe.invoices.retrieve(
        subscription.latest_invoice
      );
      const paymentIntent = await stripe.paymentIntents.confirm(
        invoice.payment_intent,
        {
          payment_method: paymentMethodId, // Explicitly pass the payment method
        }
      );
      if (paymentIntent.status === "succeeded") {
        // Update corporate status to Active
        corporate.status = "Active";
        await corporate.save();
        return "Subscription successfully renewed.";
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (error) {
      throw new Error("Error renewing subscription:" + error.message);
    }
  }
  //pay for a course
  async registerToCourse(
    corporateId,
    courseId,
    totalEnrollments,
    paymentMethodId
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let paymentIntent = null;

    try {
      // Fetch course and corporate
      const course = await Course.findById(courseId).session(session);
      if (!course) throw new Error("Course not found");

      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found");

      // Calculate price
      const price = await courseService.getCalculatedPrice(
        corporateId,
        courseId,
        totalEnrollments
      );

      // Create PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: "usd",
        payment_method: paymentMethodId,
        customer: corporate.stripeCustomerId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true, // Automatically select payment methods
          allow_redirects: "never", // Disable redirect-based methods
        },
      });
      

      // Update instructor's wallet
      await Instructor.findByIdAndUpdate(course.instructor, {
        $inc: { wallet: 0.7 * price }, // Instructor receives 70% of the price
      }).session(session);

      // Create a payment record
      await Payment.create(
        [
          {
            payerId: corporateId,
            receiverId: course.instructor,
            courseId: courseId,
            amount: price * 0.7,
            paymentId: paymentIntent.id,
          },
        ],
        { session }
      );

      // Add the course to the corporate's list
      corporate.courses.push({
        id: course._id,
        title: course.title,
        totalEnrollments,
        currentEnrollments: 0,
      });
      await corporate.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return corporate;
    } catch (error) {
      // Refund if PaymentIntent was created but something went wrong
      if (paymentIntent && paymentIntent.status === "succeeded") {
        await stripe.refunds.create({ payment_intent: paymentIntent.id });
      }

      // Rollback the transaction
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
}

module.exports = new corporateService();
