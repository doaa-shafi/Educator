const corporateService=require('../services/corporate')
const {signupSchema}=require("../validatationSchemas/user")
const {corporateSchema}=require("../validatationSchemas/corporate")
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants');

const addCorporate = async (req, res,next) => {// pay
  const { username,email,password,confirm_password,team_size,plan} = req.body;
  try {
    validate(signupSchema,{  username: username,email: email,password: password,confirm_password: confirm_password})
    validate(corporateSchema,{team_size: team_size,plan:plan})    
    const corporate=await corporateService.addCorporate(username, email,password,team_size,plan)
    res.status(201).json(corporate);
  } catch (error) {
    next(error)
  }  
};

const  createTeam=async (req, res)=> {
    try {
        const team = await corporateService.addTeam(req.id, req.body);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const  addTrainees=async(req, res)=> {
    try {
        const team = await corporateService.addTraineesToTeam(req.params.corporateId, req.params.teamId, req.body.traineeIds);
        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const  removeTrainees=async (req, res)=> {
    try {
        const team = await corporateService.removeTraineesFromTeam(req.params.corporateId, req.params.teamId, req.body.traineeIds);
        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const  assignCourseToTeam=async(req, res) =>{
    try {
        const team = await corporateService.assignCourseToTeam(req.params.corporateId, req.params.teamId, req.body.courseId);
        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const  removeCourseFromTeam=async(req, res) =>{
    try {
        const team = await corporateService.removeCourseFromTeam(req.params.corporateId, req.params.teamId, req.body.courseId);
        res.status(200).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const assignCourseToTrainee=async (req, res)=> {
    try {
        const result = await corporateService.assignCourseToTrainee(req.params.corporateId, req.body.traineeId, req.body.courseId);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
  addCorporate,
  createTeam,
    addTrainees,
    removeTrainees,
    assignCourseToTeam,
    removeCourseFromTeam,
    assignCourseToTrainee,
};
