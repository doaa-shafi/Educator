const Instructor = require("../models/users/instructor");
const User = require("../models/users/user");
const Course = require("../models/courses/course");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ConflictError } = require("../helpers/errors");
const {
  sendInstructorRequestEmail,
  sendAcceptInstructorEmail,
  sendRejectInstructorEmail,
} = require("../helpers/mailHelpers/mailUtils/sendMail");
class instructorService {
  async requestSignUp(firstName, lastName, email, password, file) {
    const foundEmail = await User.findOne({ email }).exec();
    if (foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedFilePath = `/docs/cv/${file.filename}`;
    sendInstructorRequestEmail(email);

    return await Instructor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cv: savedFilePath,
      status: "pending",
    });
  }

  async acceptInstructor(id) {
    const instructor = await Instructor.findById(id);
    sendAcceptInstructorEmail(instructor.email);
    return await Instructor.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
  }
  async rejectInstructor(id) {
    const instructor = await Instructor.findById(id);
    sendRejectInstructorEmail(instructor.email);
    return await Instructor.findByIdAndDelete(id);
  }

  async getSignedInInstructor(instructorId, includedCourses) {
    const instructor = await Instructor.findById(instructorId);

    let courses = [];
    if (includedCourses === "none") {
      courses = [];
    } else if (includedCourses === "draft") {
      // Only apply aggregation when includedCourses is "draft"
      courses = await Course.aggregate([
        {
          $match: {
            instructor: new mongoose.Types.ObjectId(instructorId),
            status: "draft",
          },
        },
        {
          $lookup: {
            from: "lessons", // Collection name for lessons
            localField: "_id",
            foreignField: "course",
            as: "lessons",
          },
        },
        {
          $addFields: {
            lessonsCount: { $size: "$lessons" },
            totalItemsCount: {
              $sum: {
                $map: {
                  input: "$lessons",
                  as: "lesson",
                  in: { $size: "$$lesson.items" },
                },
              },
            },
          },
        },
        {
          $project: {
            lessons: 0, // Exclude lessons array if not needed in the final output
          },
        },
      ]);
    } else if (includedCourses === "open") {
      courses = await Course.aggregate([
        {
          $match: {
            instructor: new mongoose.Types.ObjectId(instructorId), // Match courses for the given instructor
            status: "published", // Only include published courses
          },
        },
        {
          $lookup: {
            from: "payments", // Name of the Payment collection
            localField: "_id", // Match Course `_id`
            foreignField: "courseId", // Match Payment `courseId`
            as: "payments", // Output matched payments in this field
          },
        },
        {
          $addFields: {
            totalEarnings: {
              $sum: "$payments.amount", // Sum the `amount` field from the matched payments
            },
          },
        },
      ]);
    } else if (includedCourses === "closed") {
      courses = await Course.aggregate([
        {
          $match: {
            instructor: new mongoose.Types.ObjectId(instructorId), // Match courses for the given instructor
            status: "closed", // Only include published courses
          },
        },
        {
          $lookup: {
            from: "payments", // Name of the Payment collection
            localField: "_id", // Match Course `_id`
            foreignField: "courseId", // Match Payment `courseId`
            as: "payments", // Output matched payments in this field
          },
        },
        {
          $addFields: {
            totalEarnings: {
              $sum: "$payments.amount", // Sum the `amount` field from the matched payments
            },
          },
        },
      ]);
    } else if (includedCourses === "data") {
      const data = await Course.aggregate([
        {
          $match: {
            instructor: new mongoose.Types.ObjectId(instructorId),
            status: { $in: ["published", "closed"] }, // Match both open and closed courses
          },
        },
        {
          $group: {
            _id: null, // Group all courses together
            totalCourses: { $sum: 1 }, // Count total courses
            totalEnrollments: { $sum: "$enrolledStudents" }, // Sum enrollments across all courses
          },
        },
      ]);
      courses = data[0] || { totalCourses: 0, totalEnrollments: 0 };
    } else {
      throw new Error("Enter correct course status");
    }

    return { instructor, courses };
  }

  async getInstructor(id) {
    return await Instructor.findById(id);
  }
  async getInstructorWallet(id) {
    return await Instructor.findById(id).select({ wallet: 1 });
  }
  async updateInstructor(instructorId, updateData) {
    return await Instructor.findByIdAndUpdate(instructorId, updateData, {
      new: true,
      runValidators: true,
    });
  }
  async uploadInstructorImage(instructorId, file) {
    const savedFilePath = `/docs/instructors/${file.filename}`;
    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { image: savedFilePath },
      { new: true }
    );
    return instructor.image;
  }
}

module.exports = new instructorService();
