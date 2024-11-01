const instructorService = require("../services/instructor");
const {signupSchema}=require("../validatationSchemas/user")
const {idSchema,page_limitSchema}=require('../validatationSchemas/id,page,limit')
const {instructorSchema}=require('../validatationSchemas/instructor')
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants')
const {ValidationError}=require("../helpers/errors")

const requestSignUp = async (req, res,next) => {
  const { firstName,lastName,email,password ,confirm_password } = req.body;
  try {
    //authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.CREATE_ANY])
    if (!req.file) {
      throw new ValidationError('No file provided or file type is incorrect.')
    }
    validate(signupSchema,{firstName:firstName,lastName:lastName,email:email,password:password,confirm_password:confirm_password})
    const instructor=await instructorService.requestSignUp(firstName,lastName,email,password,req.file)
    res.status(201).json(instructor);
  } catch (error) {
    console.log(error)
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

const getSignedInInstructor = async (req, res,next) => {
  const instructorId=req.id
  const {includedCourses}=req.query
  try {
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.READ_OWN],true)
    const {instructor,courses}=await instructorService.getSignedInInstructor(instructorId,includedCourses)
    res.status(201).json({instructor,courses});
  } catch (error) {
    next(error)
  }  
    
};

const getInstuctor = async (req, res,next) => {
  const id=req.params.id
  try {
    validate(idSchema,{id:id})
    const instructor=await instructorService.getInstructor(id)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};

const updateInstuctor = async (req, res,next) => {
  const updateData = req.body;
  const instructorId=req.id
  try {
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.UPDATE_OWN],true)
    // validate(instructorSchema,{miniBiography:miniBiography})
    const instructor=await instructorService.updateInstructor(instructorId,updateData)
    res.status(201).json(instructor);
  } catch (error) {
    next(error)
  }  
    
};

const uploadInstructorImage=async(req,res,next)=>{
  const instructorId=req.id
  try {
    if (!req.file) {
      throw new ValidationError('No file provided or file type is incorrect.')
    }
    authorize(req.role,RESOURSES_NAMES.Instructor,[ACTIONS_NAMES.UPDATE_OWN],true)
    const instructorImage=await instructorService.uploadInstructorImage(instructorId,req.file)
    res.status(201).json(instructorImage);
  } catch (error) {
    next(error)
  }  
}

module.exports = {
  requestSignUp,
  acceptInstructor,
  rejectInstructor,
  getSignedInInstructor,
  getInstuctor,
  updateInstuctor,
  uploadInstructorImage,
};
