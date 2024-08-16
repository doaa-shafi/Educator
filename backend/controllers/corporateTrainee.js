const corporateTraineeService=require('../services/corporateTrainee')
const {addUserSchema}=require("../validatationSchemas/user")
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const addCorporateTrainee = async (req, res,next) => {
  const { username,email,password } = req.body;
  const corporate=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Ctrainee,[ACTIONS_NAMES.CREATE_OWN])
    validate(addUserSchema,{ username:username, email:email,password:password})
    const corporateTrainee=await corporateTraineeService.addCorporateTrainee(username, email,password,corporate)
    res.status(201).json(corporateTrainee);
  } catch (error) {
    next(error)
  }  
};

module.exports = {
  addCorporateTrainee
};
