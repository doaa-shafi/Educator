const Course = require("../models/courses/course");
const lessonService = require("./lesson");
const { ServerError, AuthorizationError } = require("../helpers/errors");
const { getVideoThumbnailUrl } = require("../helpers/videoHelpers");
const validate = require("../helpers/validate");
const { publishCourseSchema } = require("../validatationSchemas/course");

class courseService {
  async searchAndFilterCourses(search, level, priceMin, priceMax, subject) {
    let filter = {};

    if (level) {
      filter.level = level;
    }
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = priceMin;
      if (priceMax) filter.price.$lte = priceMax;
    }
    if (subject) {
      filter.subject = subject;
    }
    if (search) {
      return await Course.fuzzySearch(search).find(filter);
    } else {
      return await Course.find(filter);
    }
  }
  async getPopulerCoursesInfo() {
    return await Course.find({ status: "published" })
      .select({ lessons: 0 })
      .sort({ enrolledStudents: -1 })
      .limit(20);
  }
  async getDraftCourses(instructor) {
    return await Course.find({ instructor: instructor, status: "draft" });
  }
  async getDraftCourse(instructor, courseId) {
    return await Course.findOne({
      _id: courseId,
      instructor: instructor,
      status: "draft",
    }).select(
      "-instructor -totalMins -enrolledStudents -avgRating -ratings -status -createdAt -updatedAt -__v "
    );
  }
  async getClosedCourses(instructor) {
    return await Course.find({ instructor: instructor, status: "closed" });
  }
  async getCoursesInfo(page, limit) {
    return await Course.find({ status: "published" })
      .select({ lessons: 0 })
      .skip(limit * (page - 1))
      .limit(limit);
  }

  async getCourseInfo(id) {
    return await Course.findById(id)
      .populate({
        path: "instructor",
        select: "firstName lastName email miniBiography avgRating image",
        options: { virtuals: true },
      })
      .exec();
  }

  async getCourse(id) {
    return await Course.findById(id);
  }

  async getCalculatedPrice(courseId,totalEnrollments){
    const course=await Course.findById(courseId)
    return course.price*totalEnrollments
  }

  async createCourse(title, instructor) {
    return await Course.create({
      title: title,
      instructor: instructor,
    });
  }
  async updateCourse(courseId, updateFields) {
    if (updateFields.previewVideo) {
      updateFields.thumbnail = getVideoThumbnailUrl(updateFields.previewVideo);
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedCourse) {
      throw new Error("Course not found");
    }
    return updatedCourse;
  }

  async publishCourse(course_id, instructorId) {
    const course = await Course.findById(course_id);
    if (course.instructor != instructorId)
      throw new AuthorizationError("You do not have access");
    if (course.status === "published")
      throw new ServerError("This Course is already published");

    const plainCourse = JSON.parse(JSON.stringify(course));
    const {
      thumbnail,
      instructor,
      avgRating,
      ratings,
      enrolledStudents,
      status,
      createdAt,
      updatedAt,
      __v,
      ...courseData
    } = plainCourse;

    validate(publishCourseSchema, courseData);

    await lessonService.validateLessons(course_id);

    return await Course.findByIdAndUpdate(
      course_id,
      { status: "published" },
      { new: true }
    );
  }

  async closeCourse(course_id, instructor) {
    const course = await Course.findById(course_id);
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    if (course.status === "closed")
      throw new ServerError("This Course is already closed");
    return await Course.findByIdAndUpdate(
      course_id,
      { status: "closed" },
      { new: true }
    );
  }

  async cloneCourseAsDraft(
    course_id,
    instructor,
    oldCourseTitle,
    newCourseTitle
  ) {
    const course = await Course.findById(course_id);

    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");

    if (course.status !== "closed")
      throw new ServerError("Only closed courses can be cloned");

    if (course.title !== oldCourseTitle)
      throw new ServerError("Course title is incorrect");

    const { ratings, avgRating, ...courseData } = course.toObject();

    const clonedCourse = new Course({
      ...courseData,
      _id: undefined, // Let MongoDB generate a new ID
      title: newCourseTitle,
      status: "draft",
    });

    return await clonedCourse.save();
  }
  async openClosedCourse(course_id, instructor, oldCourseTitle) {
    const course = await Course.findById(course_id);

    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");

    if (course.status !== "closed")
      throw new ServerError("Only closed courses can be reopened");

    if (course.title !== oldCourseTitle)
      throw new ServerError("Course title is incorrect");

    course.status = "published";

    return await course.save();
  }
}

module.exports = new courseService();
