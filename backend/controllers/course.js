const courseService = require("../services/course");
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const {updateCourseSchema,courseTitleSchema}=require('../validatationSchemas/course')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants')


const searchAndFilterCourses= async (req, res) => {
  const { categories, search, level, priceMin, priceMax, page = 1, limit = 6 } = req.query;
  try {
    const {courses,totalPages}=await courseService.searchAndFilterCourses(categories, search, level, priceMin, priceMax, page, limit)
    res.status(200).json({ courses, totalPages });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getPopulerCoursesInfo = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page, 10) || 1; // Default to page 1
      const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 courses per page

      const { courses, totalCourses } = await courseService.getPopulerCoursesInfo(page, limit);

      res.status(200).json({ courses, totalCourses, page, totalPages: Math.ceil(totalCourses / limit) });
  } catch (error) {
      next(error);
  }
};

const getDraftCourses= async (req,res,next)=>{
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.READ_OWN],true)
    const courses= await courseService.getDraftCourses(instructor);
    res.status(200).json(courses)
  } catch (error) {
    next(error)
  }

}
const getDraftCourse= async (req,res,next)=>{
  const instructor=req.id
  const courseId=req.params.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.READ_OWN],true)
    const course= await courseService.getDraftCourse(instructor,courseId);
    res.status(200).json(course)
  } catch (error) {
    next(error)
  }

}
const getClosedCourses= async (req,res,next)=>{
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.READ_OWN],true)
    const courses= await courseService.getClosedCourses(instructor);
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
    console.log(error)
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
const getCalculatedPrice=async(req,res,next)=>{
  const {courseId,totalEnrollments}=req.query
  const corporateId=req.id
  console.log("juju")
  try {
    const price=await courseService.getCalculatedPrice(corporateId,courseId,totalEnrollments)
    res.status(200).json(price)
  } catch (error) {
    next(error)
  }
}
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

const updateCourse = async (req, res,next) => {
  const courseId  = req.params.id; 
  const updateFields = req.body; 
  try {
    validate(updateCourseSchema, updateFields);
    const updatedCourse=await courseService.updateCourse(courseId,updateFields)
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error)
  }
};

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
const cloneCourseAsDraft=async(req,res,next)=>{
  const courseId=req.params.id;
  const instructorId=req.id;
  const {oldCourseTitle,newCourseTitle}=req.body
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    const message=await courseService.cloneCourseAsDraft(courseId,instructorId,oldCourseTitle,newCourseTitle)
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }

}

const openClosedCourse=async(req,res,next)=>{
  const courseId=req.params.id;
  const instructorId=req.id;
  const {oldCourseTitle}=req.body
  try {
    authorize(req.role,RESOURSES_NAMES.Course_full,[ACTIONS_NAMES.UPDATE_OWN],true)//codition to be performed later in the service
    const message=await courseService.openClosedCourse(courseId,instructorId,oldCourseTitle)
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }

}

module.exports = {
  searchAndFilterCourses,
  getPopulerCoursesInfo,
  getDraftCourses,
  getDraftCourse,
  getCalculatedPrice,
  createCourse,
  updateCourse,
  getCoursesInfo,
  getCourseInfo,
  getCourse,
  getClosedCourses,
  publishCourse,
  closeCourse,
  cloneCourseAsDraft,
  openClosedCourse
}
