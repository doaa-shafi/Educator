const paymentService=require("../services/payment")
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const getPaymentsByReceiverId=async(req,res,next)=>{
    const id =req.id
    try {
      const payments=await paymentService.getPaymentsByReceiverId(id)
      res.status(200).json(payments);
    } catch (error) {
      next(error)
    }
  
  }
  module.exports={
    getPaymentsByReceiverId

  }