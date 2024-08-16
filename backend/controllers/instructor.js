const instructorService = require("../services/instructor");
const {signupSchema}=require("../validatationSchemas/user")
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const {instructorSchema}=require('../validatationSchemas/instructor')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants')

const requestSignUp = async (req, res,next) => {
  const { username,email,password ,confirm_password } = req.body;
  try {
    //authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.CREATE_ANY])
    validate(signupSchema,{username:username,email:email,password:password,confirm_password:confirm_password})
    const instructor=await instructorService.requestSignUp(username,email,password)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};


const acceptInstructor = async (req, res,next) => {
  const { id } = req.body;
  try {
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.CREATE_ANY])
    const instructor=await instructorService.acceptInstructor(id)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};

const rejectInstructor = async (req, res,next) => {
  const { id } = req.body;
  try {
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.CREATE_ANY])
    const instructor=await instructorService.rejectInstructor(id)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};

const addMiniBiography = async (req, res,next) => {
  const { miniBiography } = req.body;
  const id=req.params.id
  try {
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.UPDATE_OWN],id===req.id)
    validate(instructorSchema,{miniBiography:miniBiography})
    validate(idSchema,{id:id})
    const instructor=await instructorService.addMiniBiography(miniBiography,id)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};

module.exports = {
  requestSignUp,
  acceptInstructor,
  rejectInstructor,
  addMiniBiography,
};
