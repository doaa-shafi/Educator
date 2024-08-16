const courseService = require("../services/course");
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const {createCourseSchema,courseTitleSchema,courseLearningSchema,coursePricingSchema,videoURLSchema}=require('../validatationSchemas/course')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants')


const getPopulerCoursesInfo= async (req,res,next)=>{
  try {
    const courses= await courseService.getPopulerCoursesInfo();
    res.status(200).json(courses)
  } catch (error) {
    next(error)
  }

}
const getDraftCourses= async (req,res,next)=>{
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.READ_OWN])
    const courses= await courseService.getDraftCourses(instructor);
    res.status(200).json(courses)
  } catch (error) {
    next(error)
  }

}
const getClosedCourses= async (req,res,next)=>{
  try {
    const courses= await courseService.getPopulerCoursesInfo();
    res.status(200).json(courses)
  } catch (error) {
    next(error)
  }

}
const getCoursesInfo = async (req, res,next) => {
  const {page,limit}=req.query
  try {
    authorize(req.role,RESOURSES_NAMES.Course_info,[ACTIONS_NAMES.READ_ANY])
    validate(page_limitSchema,{page:page,limit:limit})
    const courses=await courseService.getCoursesInfo(page,limit)
    res.status(200).json(courses);
  } catch (error) {
    next(error)
  }  
};
const getCourseInfo = async (req, res,next) => {
  const  id  = req.params.id;
  try {
    
    validate(idSchema,{id:id})
    const course=await courseService.getCourseInfo(id)
    res.status(200).json(course);
  } catch (error) {
    next(error)
  }  
};
const getCourse= async (req, res,next) => {
  const  id  = req.params.id;
  try {
    validate(idSchema,{id:id})
    const course=await courseService.getCourse(id)
    res.status(200).json(course);
  } catch (error) {
    next(error)
  }  
};
const createCourse = async (req, res,next) => {
  const {title} = req.body;
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.CREATE_ANY])
    validate(courseTitleSchema,{title:title})
    const course=await courseService.createCourse(title,instructor)
    res.status(201).json(course);
  } catch (error) {
    next(error)
  }   
};
const updateCourseInfo = async (req, res,next) => {
  const {title,description,subject} = req.body;
  const id=req.params.id;
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN])
    validate(createCourseSchema,{title:title,description:description,subject:subject})
    const course=await courseService.updateCourseInfo(id,title,description,subject)
    res.status(201).json(course);
  } catch (error) {
    next(error)
  }   
};
const uploadPreviewVideo = async (req, res,next) => {
  const { previewVideo } = req.body;
  const course_id=req.params.id
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    validate(videoURLSchema,{previewVideo})
    validate(idSchema,{id:course_id})
    const course=await courseService.uploadPreviewVideo(previewVideo,course_id,instructor)
    res.status(201).json(course);
  } catch (error) {
    next(error)
  }  
}

const updateCourcePricing = async (req, res,next) => {
  const {price,quantity,discountStart,discountEnd} = req.body;
  const course_id=req.params.id
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    if(quantity>0){
      validate(coursePricingSchema,{price,quantity,discountStart,discountEnd})
    }else{
      validate(coursePricingSchema,{price})
    }
    
    validate(idSchema,{id:course_id})
    const course=await courseService.updateCourcePricing(price,quantity,discountStart,discountEnd,course_id,instructor)
    res.status(201).json(course);
  } catch (error) {
    next(error)
  }  
}

const updateCourselearnings = async (req, res,next) => {
  const { requirements,learnings,level } = req.body;
  const course_id=req.params.id
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    validate(courseLearningSchema,{requirements,learnings,level})
    validate(idSchema,{id:course_id})
    const course=await courseService.updateCourselearnings(requirements,learnings,level,course_id,instructor)
    res.status(201).json(course);
  } catch (error) {  
    next(error)
  }  
}

const publishCourse=async(req,res,next)=>{
  const {courseId}=req.body;
  const instructorId=req.id;
  
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    const message=await courseService.publishCourse(courseId,instructorId)
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }
}

const closeCourse=async(req,res,next)=>{
  const {courseId}=req.body;
  const instructorId=req.id;
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    const message=await courseService.closeCourse(courseId,instructorId)
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }

}


module.exports = {
  getPopulerCoursesInfo,
  getDraftCourses,
  getCoursesInfo,
  getCourseInfo,
  getCourse,
  createCourse,
  updateCourseInfo,
  uploadPreviewVideo,
  updateCourcePricing,
  updateCourselearnings,
  publishCourse,
  closeCourse,
}
