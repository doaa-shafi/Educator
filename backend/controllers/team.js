const teamService = require("../services/team");
const validate=require('../helpers/validate');
const authorize = require("../helpers/authorize");
const {RESOURSES_NAMES,ACTIONS_NAMES}=require('../config/constants')
const {ValidationError,AuthorizationError}=require("../helpers/errors")

const  getTeamById=async (req, res)=> {
  const corporateId=req.id;
  const teamId=req.params.id
  try {
      authorize(req.role,RESOURSES_NAMES.Corporate,[ACTIONS_NAMES.READ_OWN],true)//check later
      const team = await teamService.getTeamById(corporateId,teamId);
      res.status(200).json(team);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}

const  addTeam=async (req, res)=> {
  const {teamName}=req.body;
  const corporateId=req.id;
  try {
      authorize(req.role,RESOURSES_NAMES.Corporate,[ACTIONS_NAMES.UPDATE_OWN],true)
      //validate teamName
      const team = await teamService.addTeam(corporateId, teamName);
      res.status(201).json(team);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}

const  addTraineesToTeam=async(req, res)=> {
  const corporateId=req.id
  const {teamId}=req.params
  const {traineeIds}=req.body
  try {
      const team = await teamService.addTraineesToTeam(corporateId,teamId,traineeIds);
      res.status(200).json(team);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}

const  removeTraineesFromTeam=async (req, res)=> {
  const corporateId=req.id
  const {teamId,traineeIds}=req.params
  try {
      const team = await teamService.removeTraineesFromTeam(corporateId,teamId,traineeIds);
      res.status(200).json(team);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}

const  assignCourseToTeam=async(req, res) =>{
  const corporateId=req.id
  const {teamId,courseId}=req.params
  console.log(teamId,courseId)
  try {
      const team = await teamService.assignCourseToTeam(corporateId,teamId,courseId);
      res.status(200).json(team);
  } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message });
  }
}

const  removeCourseFromTeam=async(req, res) =>{
  const corporateId=req.id
  const {teamId,courseId}=req.params
  try {
      const team = await teamService.removeCourseFromTeam(corporateId,teamId,courseId);
      res.status(200).json(team);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
}



module.exports = {
  getTeamById,
  addTeam,
  addTraineesToTeam,
  removeTraineesFromTeam,
  assignCourseToTeam,
  removeCourseFromTeam
};
