const adminService=require('../services/admin')
const {addUserSchema}=require("../validatationSchemas/user")
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');



const addAdmin = async (req, res,next) => {
  const { username, email,password } = req.body;
  try {
    authorize(req.role,RESOURSES_NAMES.Admin,[ACTIONS_NAMES.CREATE_ANY])
    validate(addUserSchema,{ username:username, email:email,password:password})
    const admin=await adminService.addAdmin(username, email,password)
    res.status(201).json(admin);
  } catch (error) {
    next(error)
  }  
};

module.exports = {
  addAdmin,
};
