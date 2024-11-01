const Lesson = require("../models/courses/lesson");
const Course = require("../models/courses/course");
const { getVideoDuration } = require("../helpers/videoHelpers");
const { AuthorizationError } = require("../helpers/errors");
const mongoose = require("mongoose");

class lessonService {
  async getLessonsNumberByCourse(courseId) {
    return (lessonCount = await Lesson.countDocuments({ course: courseId }));
  }
  async getCourseLessons(courseId) {
    return await Lesson.find({ course: courseId });
  }
  async getCourseLessonsInfo(courseId) {
    const result = await Lesson.find({ course: courseId })
      .select("title mins quiz items.title items.duration items.type") // Select specific fields from items
      .lean() // Converts Mongoose document into plain JavaScript objects
      .exec();

    // Modify the result to include quiz count
    const formattedResult = result.map((lesson) => ({
      title: lesson.title,
      mins: lesson.mins,
      quizCount: lesson.quiz.length,
      items: lesson.items.map((item) => ({
        title: item.title,
        duration: item.duration,
        type: item.type,
      })),
    }));

    return formattedResult;
  }

  async getLesson(id) {
    return await Lesson.findById(id);
  }
  async getQuizAnswers(lessonId) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const answers = lesson.quiz.map((question) => question.answer);

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
  async addQuiz(course_id, lesson_id, exercise, instructor) {
    const course = await Course.findById(course_id);
    if (course.status === "published")
      throw new ServerError(
        "Cannot edit a course after its publishing, it must be a draft or closed to perform editing"
      );
    if (course.instructor != instructor)
      throw new AuthorizationError("You do not have access");
    const mins = 5;
    return await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { quiz: exercise  },
        $inc: { mins: mins },
      },
      { new: true }
    );
  }

  async deleteQuizQuestion(instructor,lessonId, qIndex) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    const course=await Course.findById(lesson.course)
    const instructorId= new mongoose.Types.ObjectId(instructor)
    if(!instructorId.equals(course.instructor))
      throw new AuthorizationError("You don't have access")

    if (qIndex < 0 || qIndex >= lesson.quiz.length) {
        throw new Error("Question index is out of range");
    }


    lesson.quiz.splice(qIndex, 1);

    lesson.mins -= 5;

    return await lesson.save();
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
    return await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { items: { title, link, duration: mins, type: 1 } },
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
    return await Lesson.findByIdAndUpdate(
      lesson_id,
      {
        $push: { items: { title, link: savedFilePath, duration, type: 2 } },
        $inc: { mins: duration },
      },
      { new: true }
    );
  }
  async deleteItem(instructor,lessonId, itemIndex, itemTitle) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    const course=await Course.findById(lesson.course)
    const instructorId= new mongoose.Types.ObjectId(instructor)
    if(!instructorId.equals(course.instructor))
      throw new AuthorizationError("You don't have access")

    if (itemIndex < 0 || itemIndex >= lesson.items.length) {
        throw new Error("Item index is out of range");
    }

    const item = lesson.items[itemIndex];
    if (item.title !== itemTitle) {
        throw new Error("Item title is incorrect");
    }

    lesson.items.splice(itemIndex, 1);

    lesson.mins -= item.duration;

    return await lesson.save();
}


  async validateLessons(courseId) {
    const invalidLessons = await Lesson.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $project: {
          title: 1, // Include title in projection
          titleExists: { $ne: ["$title", null] },
          minsValid: { $gt: ["$mins", 0] },
          hasItems: { $gt: [{ $size: "$items" }, 0] },
          hasQuiz: { $gt: [{ $size: "$quiz" }, 0] },
        },
      },
      {
        $match: {
          $or: [
            { titleExists: false },
            { minsValid: false },
            { hasItems: false },
            { hasQuiz: false },
          ],
        },
      },
      {
        $project: {
          title: 1, // Keep the title in the output
          reasons: {
            $concatArrays: [
              { $cond: [{ $not: "$titleExists" }, ["Missing title"], []] },
              {
                $cond: [
                  { $not: "$minsValid" },
                  ["Minutes must be greater than zero"],
                  [],
                ],
              },
              {
                $cond: [
                  { $not: "$hasItems" },
                  ["At least one item is required"],
                  [],
                ],
              },
              {
                $cond: [
                  { $not: "$hasQuiz" },
                  ["At least one quiz question is required"],
                  [],
                ],
              },
            ],
          },
        },
      },
    ]);
    // If any invalid lessons are found, throw an error with detailed reasons
    if (invalidLessons.length > 0) {
      const errorMessages = invalidLessons.map((lesson) => {
        return `Lesson "${
          lesson.title || "Untitled"
        }" has issues: ${lesson.reasons.join(", ")}`;
      });
      throw new Error(
        `Validation failed for the following lessons:\n${errorMessages.join(
          "\n"
        )}`
      );
    }

    console.log("All lessons are valid.");
  }
}
module.exports = new lessonService();
