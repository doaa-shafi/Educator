const corporateService=require('../services/corporate')
const corporateTraineeService=require('../services/corporateTrainee')
const {signupSchema}=require("../validatationSchemas/user")
const {corporateSchema}=require("../validatationSchemas/corporate")
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const  getSignedInCorporate=async (req, res)=> {
  const corporateId=req.id;
  try {
      authorize(req.role,RESOURSES_NAMES.Corporate,[ACTIONS_NAMES.READ_OWN],true)
      const corporate = await corporateService.getCorporateById(corporateId);
      res.status(200).json(corporate);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}

const  getSignedInCorporateWithTrainees=async (req, res)=> {
    const corporateId=req.id;
    try {
        authorize(req.role,RESOURSES_NAMES.Corporate,[ACTIONS_NAMES.READ_OWN],true)
        const corporate = await corporateService.getCorporateById(corporateId);
        const trainees=await corporateTraineeService.getTraineesByCorporate(corporateId);
        res.status(200).json({corporate,trainees});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
const  getSignedInCorporateWithTeams=async (req, res)=> {
    const corporateId=req.id;
    try {
        authorize(req.role,RESOURSES_NAMES.Corporate,[ACTIONS_NAMES.READ_OWN],true)
        const corporate = await corporateService.getCorporateByIdWithTeams(corporateId);
        res.status(200).json(corporate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



const addCorporate = async (req, res,next) => {// pay
  const { username,email,password,confirm_password,plan,paymentMethodId} = req.body;
  console.log(username)
  try {
    validate(signupSchema,{  firstName: username,lastName:username,email: email,password: password,confirm_password: confirm_password})
    validate(corporateSchema,{plan:plan})    
    const corporate=await corporateService.addCorporate(username, email,password,plan,paymentMethodId)
    res.status(201).json(corporate);
  } catch (error) {
    next(error)
  }  
};


module.exports = {
  getSignedInCorporate,
  getSignedInCorporateWithTrainees,
  getSignedInCorporateWithTeams,
  addCorporate,
};
