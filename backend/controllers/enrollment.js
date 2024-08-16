const enrollmentService=require('../services/enrollment')
const {addUserSchema}=require("../validatationSchemas/user")
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const addEnrollment=async(req,res,next)=>{
  const { courseId } = req.body;
  const traineeId=req.id
  try {
    const enrollment=await enrollmentService.addEnrollment(traineeId,courseId)
    return res.status(201).json(enrollment)
  } catch (error) {
    next(error)
  }
  
}
const updateProgress = async (req, res,next) => {
  const { courseId,lessonId,itemNumber } = req.body;
  const traineeId=req.id
  try {
    const enrollment=await enrollmentService.updateProgress(traineeId, courseId, lessonId, itemNumber)
    return res.status(200).json(enrollment);
  } catch (error) {
    next(error)
  }  
};
const submitQuiz = async (req, res,next) => {
  try {
      const { courseId, lessonId, answers } = req.body;
      const traineeId=req.id

      const result = await enrollmentService.submitQuiz(traineeId,courseId, lessonId, answers);

      res.json({
          success: true,
          ...result
      });
  } catch (error) {
      next(error)
  }
};
const getTraineeEnrollment=async(req,res,next)=>{
  const traineeId=req.id
  const {courseId}=req.query
  try {
    const enrollment=await enrollmentService.getTraineeEnrollment(traineeId,courseId)
    return res.status(200).json(enrollment);
  } catch (error) {
    next(error)
  }  

}
const getTraineeEnrollmentsInfo=async(req,res,next)=>{
  const traineeId=req.id
  try {
    const enrollments=await enrollmentService.getTraineeEnrollmentsInfo(traineeId)
    return res.status(200).json(enrollments);
  } catch (error) {
    next(error)
  }  

}

module.exports = {
  addEnrollment,
  updateProgress,
  submitQuiz,
  getTraineeEnrollment,
  getTraineeEnrollmentsInfo,
};
