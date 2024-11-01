const corporateTraineeService=require('../services/corporateTrainee')
const {signupSchema}=require("../validatationSchemas/user")
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const getCorporateTrainee = async (req, res,next) => {
  const requesterId=req.id
  const traineeId=req.params.id
  try {
    authorize(req.role,RESOURSES_NAMES.CTrainee,[ACTIONS_NAMES.READ_OWN],true) 
    validate(idSchema,{id:traineeId})
    const trainee= await corporateTraineeService.getCorporateTrainee(requesterId,traineeId);
    res.status(200).json(trainee);
  } catch (error) {
    next(error)
  }  
};

const addCorporateTrainee = async (req, res,next) => {
  const { firstName,lastName,email,password,confirm_password} = req.body;
  const corporateId=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.CTrainee,[ACTIONS_NAMES.CREATE_ANY])
    validate(signupSchema,{  firstName, lastName,email: email,password: password,confirm_password: confirm_password}) 
    const corporateTrainee=await corporateTraineeService.addCorporateTrainee(firstName,lastName, email,password,corporateId)
    res.status(201).json(corporateTrainee);
  } catch (error) {
    next(error)
  }  
};
const removeCorporateTrainee = async (req, res,next) => {
  const { traineeId } = req.body;
  const corporateId=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.CTrainee,[ACTIONS_NAMES.DELETE_OWN],true)//check if this trainee belongs to this corporate in the service
    validate(idSchema,{id:traineeId})
    await corporateTraineeService.removeCorporateTrainee(traineeId,corporateId)
    res.status(200).json("Trainee deleted successfully");
  } catch (error) {
    next(error)
  }  
};
const getTraineesByCorporate = async (req, res,next) => {
  const corporateId=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.CTrainee,[ACTIONS_NAMES.READ_OWN],true) // true as getting trainees is by corporateId
    const trainees = await corporateTraineeService.getTraineesByCorporate(corporateId);
    res.status(200).json(trainees);
  } catch (error) {
    next(error)
  }  
};
const assignCourseToTrainee=async (req, res)=> {
  const corporateId=req.id
  const {traineeId,courseId}=req.body
  try {
      const result = await corporateTraineeService.assignCourseToTrainee(corporateId,traineeId,courseId);
      res.status(200).json(result);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}
const removeCourseFromTrainee=async(req,res)=>{
  const corporateId=req.id
  const {traineeId,courseId}=req.params
  try {
      const result=corporateTraineeService.removeCourseFromTrainee(traineeId, courseId, corporateId)
      res.status(200).json(result)
  } catch (error) {
      res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getCorporateTrainee,
  addCorporateTrainee,
  removeCorporateTrainee,
  getTraineesByCorporate,
  assignCourseToTrainee,
  removeCourseFromTrainee,
};
