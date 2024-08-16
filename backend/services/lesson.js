const Lesson = require("../models/courses/lesson");
const Course = require("../models/courses/course");
const { getVideoDuration } = require("../helpers/videoHelpers");
const { AuthorizationError } = require("../helpers/errors");

class lessonService {
  async getCourseLessons(courseId) {
    return await Lesson.find({ course: courseId });
  }
  async getCourseLessonsInfo(courseId) {
    const result = await Lesson.find({ course: courseId }).select('title mins');
    return result;
  }

  async getLesson(id) {
    return await Lesson.findById(id);
  }
  async getQuizAnswers(lessonId) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    const answers = lesson.quiz.map((question) => (question.answer));

    return answers;
}

  async createLesson(title, course_id, instructor) {
    const course = await Course.findById(course_id);
    if (course.status === "published")
      throw new ServerError(
        "Cannot edit a course after its publishing, it must be a draft or closed to perform editing"
      );
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    return await Lesson.create({
      title: title,
      course: course_id,
    });
  }
  async addQuiz(course_id, lesson_id, exercises, instructor) {
    const course = await Course.findById(course_id);
    if (course.status === "published")
      throw new ServerError(
        "Cannot edit a course after its publishing, it must be a draft or closed to perform editing"
      );
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    const mins = exercises.length * 5;
    await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { quiz: { $each: exercises } },
        $inc: { mins: mins },
      },
      { new: true }
    );
  }

  //add video and description
  async addVideo(course_id, lesson_id, title, link, instructor) {
    const course = await Course.findById(course_id);
    if (course.status === "published")
      throw new ServerError(
        "Cannot edit a course after its publishing, it must be a draft or closed to perform editing"
      );
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    const duration = await getVideoDuration(link);
    const mins = duration.totalMins;
    await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { items: { title, link, duration:mins, type: 1 } },
        $inc: { mins: mins },
      },
      { new: true }
    );
  }

  // add lecture to subtitle
  async addLecture(course_id, lesson_id, title, duration, instructor, pdfFile) {
    const course = await Course.findById(course_id);
    if (course.status === "published")
      throw new ServerError(
        "Cannot edit a course after its publishing, it must be a draft or closed to perform editing"
      );
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    const savedFilePath = `/docs/lectures/${pdfFile.filename}`;
    await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { items: { title, link: savedFilePath, duration, type: 2 } },
        $inc: { mins: duration },
      },
      { new: true }
    );
  }
}
module.exports = new lessonService();
