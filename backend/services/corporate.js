const Corporate = require("../models/users/corporate");
const User = require("../models/users/user");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);

class corporateService {
  async getCorporateById(corporateId) {
    return await Corporate.findById(corporateId);
  }
  async getCorporateByIdWithTeams(corporateId) {
    return await Corporate.findById(corporateId).populate("teams").exec();
  }
  async addCorporate(username, email, password, plan, paymentMethodId) {
    const foundEmail = await User.findOne({ email }).exec();
    if (foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("lolololo");
    const customer = await stripe.customers.create({
      email: email,
      name: username,
      payment_method: paymentMethodId, // Use the PaymentMethod ID
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    console.log(paymentMethodId)
    console.log(customer);
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 1);

    return await Corporate.create({
      firstName: username,
      lastName: username,
      email: email,
      password: hashedPassword,
      plan: plan,
      stripeCustomerId: customer.id,
      status: "Active",
      endDate: endDate,
      lastPaymentDate: today,
    });
  }
}

module.exports = new corporateService();
