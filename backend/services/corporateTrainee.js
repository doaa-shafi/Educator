const CorporateTrainee = require("../models/users/corporateTrainee");
const Corporate = require("../models/users/corporate");
const User = require("../models/users/user");
const Course = require("../models/courses/course");
const teamService = require("./team");
const enrollmentService = require("../services/enrollment");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ConflictError, AuthorizationError } = require("../helpers/errors");

class corporateTraineeService {
  async getCorporateTrainee(requesterId, traineeId) {
    const trainee = await CorporateTrainee.findById(traineeId);

    if (!trainee) {
      throw new Error("Trainee not found.");
    }
    const corporateObjectId = new mongoose.Types.ObjectId(requesterId);
    if (
      !trainee.corporate.equals(corporateObjectId) &&
      requesterId !== traineeId
    ) {
      throw new AuthorizationError("You don't have access.");
    }
    const enrollments = await enrollmentService.getTraineeEnrollmentsInfo(
      traineeId
    );
    trainee.enrollments = enrollments;
    return trainee;
  }

  async getTraineesByCorporate(corporateId) {
    return await CorporateTrainee.aggregate([
      {
        $match: { corporate: new mongoose.Types.ObjectId(corporateId) },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "trainee",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" },
          totalCompletedDuration: { $sum: "$enrollments.completedDuration" }, // in minutes
          averageCompletedHoursPerDay: {
            $cond: [
              { $gt: [{ $size: "$enrollments" }, 0] },
              {
                $avg: {
                  $map: {
                    input: "$enrollments",
                    as: "enrollment",
                    in: {
                      $cond: [
                        {
                          $gt: [
                            {
                              $subtract: [new Date(), "$$enrollment.createdAt"],
                            },
                            0,
                          ],
                        },
                        {
                          $divide: [
                            { $divide: ["$$enrollment.completedDuration", 60] }, // Convert minutes to hours
                            {
                              $divide: [
                                {
                                  $subtract: [
                                    new Date(),
                                    "$$enrollment.createdAt",
                                  ],
                                },
                                1000 * 60 * 60 * 24, // Convert milliseconds to days
                              ],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          enrollments: 0, // Exclude enrollment details if not needed
        },
      },
    ]);
  }

  async addCorporateTrainee(firstName, lastName, email, password, corporateId) {
    const corporate = await Corporate.findById(corporateId);
    if (!corporate) throw new Error("Corporate not found.");

    const count = await CorporateTrainee.countDocuments({
      corporate: mongoose.Types.ObjectId(corporateId),
    });

    if (corporate.plan === "Standard" && count === 20) {
      throw new Error(
        "You reached the limit of number of trainees in your corporate. You can upgrade your plan to add more trainees."
      );
    }

    const foundEmail = await User.findOne({ email }).exec();
    if (foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await CorporateTrainee.create({
      firstName,
      lastName,
      email: email,
      password: hashedPassword,
      corporate: corporateId,
    });
  }

  async removeCorporateTrainee(traineeId, corporateId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trainee = await CorporateTrainee.findById(traineeId).session(
        session
      );
      if (!trainee) throw new Error("Trainee not found");

      const corporateObjectId = new mongoose.Types.ObjectId(corporateId);
      if (!trainee.corporate.equals(corporateObjectId)) {
        throw new AuthorizationError("You don't have access.");
      }

      await CorporateTrainee.findByIdAndDelete(traineeId).session(session);

      await teamService.removeTraineeFromAllTeams(traineeId, session);

      await enrollmentService.removeEnrollmentsByTrainee(traineeId, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async assignCourseToTrainee(corporateId, traineeId, courseId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const corporate = await Corporate.findById(corporateId).session(session);
      const trainee = await CorporateTrainee.findById(traineeId).session(
        session
      );
      const course = await Course.findById(courseId).session(session);

      if (!corporate || !trainee || !course) {
        throw new Error("Corporate or Course or Trainee not found.");
      }

      const corporateObjectId = new mongoose.Types.ObjectId(corporateId);
      if (!trainee.corporate.equals(corporateObjectId)) {
        throw new AuthorizationError("You don't have access.");
      }

      if (corporate.plan === "Standard" && course.level === "advanced") {
        throw new Error("Standard plan cannot assign advanced level courses.");
      }

      // Enroll the trainee in the course
      await enrollmentService.addEnrollment(traineeId, courseId, session);

      await session.commitTransaction();
      session.endSession();

      return { traineeId, courseId };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async removeCourseFromTrainee(traineeId, courseId, corporateId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trainee = await CorporateTrainee.findById(traineeId).session(
        session
      );
      const corporate = await Corporate.findById(corporateId).session(session);
      if (!corporate || !trainee)
        throw new Error("Corporate or Trainee not found.");

      const corporateObjectId = new mongoose.Types.ObjectId(corporateId);
      if (!trainee.corporate.equals(corporateObjectId)) {
        throw new AuthorizationError("You don't have access.");
      }

      const enrollment =
        await enrollmentService.removeEnrollmentByTraineeAndCourse(
          traineeId,
          courseId,
          session
        );
      if (!enrollment) {
        throw new Error("Enrollment not found for this trainee and course.");
      }

      await session.commitTransaction();
      session.endSession();

      return { traineeId, courseId };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new corporateTraineeService();
