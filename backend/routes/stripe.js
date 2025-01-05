const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_S_KEY);
const Corporate = require("../models/users/corporate");
const IndividualTrainee = require("../models/users/individualTrainee");

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Stripe events
  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      // Update corporate subscription status to "Active"
      const corporate = await Corporate.findOne({ stripeCustomerId: customerId });
      if (corporate) {
        corporate.status = "Active";
        await corporate.save();
        console.log(`Corporate ${corporate.email} subscription updated to Active.`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      // Update corporate subscription status to "Pending" if payment failed
      const corporate = await Corporate.findOne({ stripeCustomerId: customerId });
      if (corporate) {
        corporate.status = "Pending";
        await corporate.save();
        console.log(`Corporate ${corporate.email} subscription updated to Pending.`);
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const customerId = paymentIntent.customer;
      const metadata = paymentIntent.metadata; // Use metadata to distinguish purpose

      if (metadata.purpose === "add_course") {
        // Handle course addition for corporates
        const corporate = await Corporate.findOne({ stripeCustomerId: customerId });
        if (corporate) {
          console.log(`Corporate ${corporate.email} successfully added a course.`);
          // Additional logic for course addition (e.g., save course details)
        }
      } else if (metadata.purpose === "purchase_course") {
        // Handle course purchase for individual trainees
        const trainee = await IndividualTrainee.findOne({ stripeCustomerId: customerId });
        if (trainee) {
          console.log(`Trainee ${trainee.email} successfully purchased a course.`);
          // Additional logic for granting course access
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const customerId = paymentIntent.customer;
      const metadata = paymentIntent.metadata;

      if (metadata.purpose === "add_course") {
        console.error(`Corporate payment failed for adding a course. Customer ID: ${customerId}`);
        // Notify the corporate user (e.g., send email or in-app message)
      } else if (metadata.purpose === "purchase_course") {
        console.error(`Trainee payment failed for purchasing a course. Customer ID: ${customerId}`);
        // Notify the trainee (e.g., send email or in-app message)
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Webhook received");
});

module.exports = router;
