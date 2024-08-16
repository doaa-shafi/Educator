const Corporate= require("../models/users/corporate")
const User=require("../models/users/user")
const Course = require('../models/Course');
const enrollmentService = require('./enrollmentService');
const bcrypt = require("bcrypt");

class corporateService{

  async addCorporate(username,email,password,team_size,plan){
    
    const foundUsername = await User.findOne({ username }).exec();
    const foundEmail = await User.findOne({ email }).exec();
    
    if(foundUsername) throw new ConflictError("Username is already taken");
    
    if(foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return await Corporate.create({
      username: username,
      email:email,
      password:hashedPassword,
      role:'corporate',
      team_size:team_size,
      plan:plan
    });
  }
  

// Add a new team
async  addTeam(corporateId, teamData) {
    const corporate = await Corporate.findById(corporateId);
    if (!corporate) throw new Error('Corporate not found.');

    if (corporate.plan === 'Standard' && corporate.teams.length >= 1) {
        throw new Error('Standard plan allows only one team.');
    }

    corporate.teams.push(teamData);
    await corporate.save();
    return corporate.teams[corporate.teams.length - 1];
}

// Add trainees to a team
async  addTraineesToTeam(corporateId, teamId, traineeIds) {
    const corporate = await Corporate.findById(corporateId).populate('teams.trainees');
    const seatLimit = corporate.plan === 'Standard' ? 30 : Infinity;

    if (corporate.team_size + traineeIds.length > seatLimit) {
        throw new Error('Seat limit exceeded for this plan.');
    }
    const team = corporate.teams.id(teamId);
    if (!team) throw new Error('Team not found.');

    team.trainees.push(...traineeIds);
    await corporate.save();
    return team;
}

// Remove trainees from a team
async  removeTraineesFromTeam(corporateId, teamId, traineeIds) {
    const corporate = await Corporate.findById(corporateId).populate('teams.trainees');
    const team = corporate.teams.id(teamId);
    if (!team) throw new Error('Team not found.');

    team.trainees = team.trainees.filter(traineeId => !traineeIds.includes(traineeId.toString()));
    await corporate.save();
    return team;
}

// Assign a course to a team
async  assignCourseToTeam(corporateId, teamId, courseId) {
    const corporate = await Corporate.findById(corporateId).populate('teams.trainees');
    const team = corporate.teams.id(teamId);
    const course = await Course.findById(courseId);
    if (!team || !course) throw new Error('Team or Course not found.');

    if (corporate.plan === 'Standard' && course.level === 'advanced') {
        throw new Error('Standard plan cannot assign advanced level courses.');
    }

    team.courses.push(courseId);
    await corporate.save();

    // Enroll each trainee in the team to the course
    for (const trainee of team.trainees) {
        await enrollmentService.addEnrollment(trainee._id, courseId);
    }

    return team;
}

// Remove a course from a team
async  removeCourseFromTeam(corporateId, teamId, courseId) {
    const corporate = await Corporate.findById(corporateId);
    const team = corporate.teams.id(teamId);
    if (!team) throw new Error('Team not found.');

    team.courses.pull(courseId);
    await corporate.save();
    return team;
}

// Assign a course to an individual trainee
async  assignCourseToTrainee(corporateId, traineeId, courseId) {
    const corporate = await Corporate.findById(corporateId);
    const course = await Course.findById(courseId);
    if (!corporate || !course) throw new Error('Corporate or Course not found.');

    if (corporate.plan === 'Standard' && course.level === 'advanced') {
        throw new Error('Standard plan cannot assign advanced level courses.');
    }

    // Enroll the trainee in the course
    await enrollmentService.addEnrollment(traineeId, courseId);

    return { traineeId, courseId };
}


}

module.exports = new corporateService()
