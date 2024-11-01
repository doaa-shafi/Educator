const Payment = require("../models/other/payment");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);

class paymentService {
  async getPaymentsByReceiverId(id){
    return await Payment.find({receiverId:id}).populate({
      path: "payerId",
      select: "__t -_id", 
    })
    .populate({
      path: "courseId",
      select: "title -_id", 
    })
    .exec();
  }
  async chargeCorporate(corporate, session) {
    let charge = null;
    try {
      const price = corporate.plan === "Standard" ? 129.9 : 229.9;

      charge = await stripe.charges.create({
        amount: price * 100, // Stripe expects the amount in cents
        currency: "usd",
        description: "Corporate subscription",
        source: token.id,
      });
      await Payment.create(
        [
          {
            userId: corporate._id,
            courseId: courseId,
            amount: price,
            paymentId: charge.id,
          },
        ],
        { session }
      );
    } catch (error) {
      if (charge !== null) {
        await stripe.refunds.create({ charge: charge.id });
      }
      throw error;
    }
  }
  
}

module.exports = new paymentService();
