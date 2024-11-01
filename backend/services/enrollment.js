const Enrollment = require("../models/courses/enrollment");
const Lesson = require("../models/courses/lesson");
const lessonService = require("./lesson");

class enrollmentService {
  async addEnrollment(trainee, course, session) {
    const existingEnrollment = await Enrollment.findOne({
      trainee,
      course,
    }).session(session);
    if (existingEnrollment) {
      return existingEnrollment; // Enrollment already exists, return it instead of creating a new one
    }
    const lessons = await lessonService.getCourseLessons(course);
    const result = [];
    let totalDuration = 0; // Initialize total duration

    for (let i = 0; i < lessons.length; i++) {
      const items = [];
      const tmp = lessons[i];

      for (let j = 0; j < tmp.items.length; j++) {
        const itemDuration = tmp.items[j].duration;
        items.push({ done: false, duration: itemDuration });

        // Accumulate the total duration of all items
        totalDuration += itemDuration;
      }
      totalDuration += tmp.quiz.length * 5;

      const lesson = {
        lessonID: tmp._id,
        items,
        notes: "",
        quiz: { passed: false, grade: 0 },
      };
      result.push(lesson);
    }

    // Use the session when creating the enrollment to ensure it's part of the transaction
    return await Enrollment.create(
      [
        {
          course: course,
          trainee: trainee,
          lessons: result,
          totalDuration: totalDuration,
          myRating: { rating: 0, review: "" },
        },
      ],
      { session } // Pass the session as an option here
    );
  }

  async updateProgress(traineeId, courseId, lessonId, itemNumber) {
    const enrollment = await Enrollment.findOne({
      course: courseId,
      trainee: traineeId,
    });
    if (!enrollment) throw new Error("Enrollment not found");

    const lesson = enrollment.lessons.find((lesson) =>
      lesson.lessonID.equals(lessonId)
    );
    if (!lesson) throw new Error("Lesson not found");

    const item = lesson.items[itemNumber];
    if (!item) throw new Error("Item not found");

    if (!item.done) {
      // Mark item as done and update progress
      item.done = true;
      enrollment.completedDuration += item.duration;

      // Check if the course is completed
      if (enrollment.completedDuration === enrollment.totalDuration) {
        enrollment.done = true;
      }

      await enrollment.save();
      return enrollment;
    }
  }

  async submitQuiz(traineeId, courseId, lessonId, answers) {
    // Step 1: Find the enrollment for the specific course and trainee
    const enrollment = await Enrollment.findOne({
      course: courseId,
      trainee: traineeId,
    });
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    // Step 2: Find the specific lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Step 3: Locate the specific lesson within the enrollment record
    const lessonIndex = enrollment.lessons.findIndex(
      (l) => l.lessonID.toString() === lessonId
    );
    if (lessonIndex === -1) {
      throw new Error("Lesson not found in enrollment");
    }

    // Step 4: Check if the quiz has already been passed
    if (enrollment.lessons[lessonIndex].quiz.passed) {
      throw new Error("Quiz has already been passed. You cannot retake it.");
    }

    // Step 5: Calculate the quiz result
    const correctAnswers = lesson.quiz.map(
      (q, index) => q.answer === answers[index]
    );
    const totalQuestions = lesson.quiz.length;
    const correctCount = correctAnswers.filter(Boolean).length;
    const percentage = (correctCount / totalQuestions) * 100;
    const points = totalQuestions * 5;

    // Step 6: Update the quiz status and the enrollment
    enrollment.lessons[lessonIndex].quiz.passed = percentage >= 75;
    enrollment.lessons[lessonIndex].quiz.grade = percentage;
    if (enrollment.lessons[lessonIndex].quiz.passed) {
      enrollment.completedDuration += points; // Only add points if the quiz is passed
    }
    enrollment.lessons[lessonIndex].quiz.answers = answers;

    // Step 7: Save the updated enrollment
    await enrollment.save();

    // Step 8: Return the result of the quiz
    return {
      passed: enrollment.lessons[lessonIndex].quiz.passed,
      percentage,
      completedDuration: enrollment.completedDuration,
      results: lesson.quiz.map((q, index) => q.answer === answers[index]),
    };
  }

  async getTraineeEnrollment(traineeId, courseId) {
    const enrollment = await Enrollment.findOne({
      trainee: traineeId,
      course: courseId,
    })
      .populate({
        path: "course",
        select: "title subject", // Include only the 'title' and 'subject' fields
      })
      .exec();

    const lessons = await Lesson.find({ course: courseId })
      .select(
        "title mins items quiz.question quiz.choiceA quiz.choiceB quiz.choiceC quiz.choiceD quiz.comment"
      ) // Exclude 'answers'
      .exec();

    return { enrollment, lessons };
  }

  async getTraineeEnrollmentsInfo(traineeId) {
    const enrollments = await Enrollment.find({ trainee: traineeId })
      .populate("course") // Populates the course details
      .exec();

    return enrollments;
  }

  async getTraineeEnrollmentsCount(traineeId) {
    await Enrollment.countDocuments({ trainee: traineeId });
  }

  async removeEnrollmentsByTrainee(traineeId, session) {
    return await Enrollment.deleteMany({ trainee: traineeId }).session(session);
  }

  async removeEnrollmentByTraineeAndCourse(traineeId, courseId,session) {
    return await Enrollment.findOneAndDelete(
      {
        trainee: traineeId,
        course: courseId,
      },
      { session } 
    );
  }
  async removeEnrollmentsByTraineesAndCourse(traineeIds, courseId, session) {
    return await Enrollment.deleteMany(
      {
        trainee: { $in: traineeIds },
        course: courseId,
      },
      { session }
    );
  }
  async removeEnrollmentsByTraineesAndCourses(traineeIds, courseIds, session) {
    const result = await Enrollment.deleteMany(
      {
        trainee: { $in: traineeIds },
        course: { $in: courseIds },
      },
      { session }
    );
    return result;
  }
}

module.exports = new enrollmentService();
