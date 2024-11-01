const Team = require("../models/users/team");
const Corporate = require("../models/users/corporate");
const Course = require("../models/courses/course");
const enrollmentService=require('./enrollment')
const mongoose =require('mongoose')

class teamService {
  async getTeamById(corporateId, teamId) {
    const corporate = await Corporate.findById(corporateId);
    if (!corporate) {
      throw new Error("Corporate not found");
    }
    if (!corporate.teams.includes(teamId)) {
      throw new Error("Team does not belong to this corporate");
    }
    return await Team.findById(teamId).populate("courses trainees").exec();
  }

  async addTeam(corporateId, teamName) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found.");

      if (corporate.plan === "Standard") {
        throw new Error("Standard plan does not allow creating teams.");
      }

      const team = await Team.create([{ name: teamName }], { session });

      corporate.teams.push(team[0]._id);
      await corporate.save({ session });

      await session.commitTransaction();
      session.endSession();

      return team[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async removeTraineeFromAllTeams(traineeId, session) {
    await Team.updateMany(
      { trainees: traineeId },
      { $pull: { trainees: traineeId } }
    ).session(session);
  }

  // Add trainees to a team
  async addTraineesToTeam(corporateId, teamId, traineeIds) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found.");

      if (corporate.plan === "Standard") {
        throw new Error("Standard plan does not allow creating teams.");
      }

      const team = await Team.findById(teamId).session(session);
      if (!team) throw new Error("Team not found.");

      const newTraineeIds = traineeIds.filter(
        (traineeId) => !team.trainees.includes(traineeId)
      );

      if (newTraineeIds.length > 0) {
        team.trainees.push(...newTraineeIds);
        await team.save({ session });
        console.log(team.courses);
        const courseIds = team.courses.map((course) => course._id);
        console.log(courseIds);
        for (const traineeId of newTraineeIds) {
          for (const courseId of courseIds) {
            await enrollmentService.addEnrollment(traineeId, courseId, session);
          }
        }
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return team;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Remove trainees from a team
  async removeTraineesFromTeam(
    corporateId,
    teamId,
    traineeIds,
    removeEnrollments
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found.");

      const team = await Team.findById(teamId).session(session);
      if (!team) throw new Error("Team not found.");

      team.trainees = team.trainees.filter(
        (traineeId) => !traineeIds.includes(traineeId.toString())
      );

      if (removeEnrollments) {
        const courseIds = team.courses.map((course) => course._id);
        await enrollmentService.removeEnrollmentsByTraineesAndCourses(
          traineeIds,
          courseIds,
          session
        );
      }

      await team.save({ session });
      await corporate.save({ session });

      await session.commitTransaction();
      session.endSession();

      return team;
    } catch (error) {
      // Rollback transaction in case of error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Assign a course to a team
  async assignCourseToTeam(corporateId, teamId, courseId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found.");

      if (corporate.plan === "Standard") {
        throw new Error("Standard plan does not allow creating teams.");
      }

      const team = await Team.findById(teamId).session(session);
      const course = await Course.findById(courseId).session(session);
      if (!team || !course) throw new Error("Team or Course not found.");

      if (!team.courses.includes(course._id)) {
        team.courses.push(new mongoose.Types.ObjectId(courseId));
        await team.save({ session });

        for (const trainee of team.trainees) {
          await enrollmentService.addEnrollment(trainee, courseId, session);
        }
      }
      await session.commitTransaction();
      session.endSession();

      return team;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async removeCourseFromTeam(corporateId, teamId, courseId, removeEnrollments) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate) throw new Error("Corporate not found.");

      const team = corporate.teams.id(teamId);
      if (!team) throw new Error("Team not found.");

      team.courses.pull(courseId);

      if (removeEnrollments) {
        const traineeIds = team.trainees.map((trainee) => trainee._id);
        await enrollmentService.removeEnrollmentsByTraineesAndCourse(
          traineeIds,
          courseId,
          session
        );
      }

      await corporate.save({ session });

      await session.commitTransaction();
      session.endSession();

      return team;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new teamService();
