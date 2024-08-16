const lessonService = require("../services/lesson");
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const {createLessonSchema,quizSchema,videoSchema,lectureSchema}=require('../validatationSchemas/lesson')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');
const course = require("../models/courses/course");
const { ValidationError } = require("../helpers/errors");

const getCourseLessons=async(req,res,next)=>{
  const courseId = req.query.courseId;
  try {
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.READ_OWN])
    validate(idSchema,{id:courseId})
    const lessons=await lessonService.getCourseLessons(courseId)
    res.status(200).json(lessons);
  } catch (error) {
    next(error)
  }

}
const getCourseLessonsInfo=async(req,res,next)=>{
  const courseId = req.query.courseId;
  try {

    validate(idSchema,{id:courseId})
    const lessons=await lessonService.getCourseLessonsInfo(courseId)
    res.status(200).json(lessons);
  } catch (error) {
    next(error)
  }

}
const getLesson = async (req, res,next) => {
  const  id  = req.params.id;
  try {
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.READ_OWN])
    validate(idSchema,{id:id})
    const lesson=await lessonService.getLesson(id)
    res.status(200).json(lesson);
  } catch (error) {
    next(error)
  }  
};
const getQuizAnswers=async(req, res,next)=> {
  try {
      const { lessonId } = req.params;
      const quizAnswers = await lessonService.getQuizAnswers(lessonId);
      res.status(200).json(quizAnswers);
  } catch (error) {
      next(error)
  }
}

const createLesson = async (req, res,next) => {
  const {courseId,title} = req.body;
  try {
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.CREATE_ANY])
    validate(createLessonSchema,{title:title})
    const lesson =await lessonService.createLesson(title,courseId,req.id)
    res.status(201).json(lesson);
  } catch (error) {
    next(error)
  }   
};
const addQuiz = async (req, res,next) => {
  const { course_id,lesson_id, exercises } = req.body;
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.UPDATE_OWN],true)// condition to be performed later in the service
    validate(idSchema,{id:course_id})
    validate(idSchema,{id:lesson_id})
    const lesson=await lessonService.addQuiz(course_id,lesson_id,exercises,instructor)
    res.status(201).json(lesson);
  } catch (error) {
    next(error)
  }  
}

const addVideo = async (req, res,next) => {
  const { course_id,lesson_id, title, link } = req.body;
  const instructor=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.UPDATE_OWN],true)// condition to be performed later in the service
    validate(videoSchema,{link:link,title:title})
    validate(idSchema,{id:course_id})
    validate(idSchema,{id:lesson_id})
    const lesson=await lessonService.addVideo(course_id,lesson_id, title, link,instructor)
    res.status(201).json(lesson);
  } catch (error) {
    next(error)
  }  
}
const addLecture = async (req, res,next) => {
  try {
    const { course_id,lesson_id, title, duration } = req.body;
    const instructor=req.id

    if (!req.file) {
      throw new ValidationError('No file provided or file type is incorrect.')
    }
    authorize(req.role,RESOURSES_NAMES.Lesson,[ACTIONS_NAMES.UPDATE_OWN],true)// condition to be performed later in the service
    validate(lectureSchema,{title:title,duration:duration})
    validate(idSchema,{id:course_id})
    validate(idSchema,{id:lesson_id})
    const lesson=await lessonService.addLecture(course_id,lesson_id, title, duration,instructor,req.file)
    res.status(201).json({ message: 'Lecture uploaded successfully', lesson });
  } catch (error) {
    next(error)
  }
  
}




module.exports = {
  getCourseLessons,
  getCourseLessonsInfo,
  getLesson,
  getQuizAnswers,
  createLesson,
  addQuiz,
  addVideo,
  addLecture,
}
