const cron = require('node-cron');
const Corporate = require('../models/users/corporate');
const paymentService = require('../services/payment');
const mongoose=require("mongoose")

const renewSubscriptions = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const subscriptionsDue = await Corporate.find({
        endDate: { $lte: new Date() },
        status: 'Active',
      }).session(session);
  
      for (const subscription of subscriptionsDue) {
        subscription.endDate = new Date(subscription.endDate.setMonth(subscription.endDate.getMonth() + 1));
        subscription.lastPaymentDate = new Date();
        await subscription.save({ session });
        await paymentService.chargeCorporate(subscription, session);
      }
  
     
      await session.commitTransaction();
    } catch (err) {
      console.error(`Failed to renew subscriptions:`, err);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  };
// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', renewSubscriptions);

module.exports = { renewSubscriptions };
