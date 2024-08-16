const Enrollment = require("../models/courses/enrollment");
const Lesson = require("../models/courses/lesson");
const lessonService = require("./lesson");

class enrollmentService {
  async addEnrollment(trainee, course) {
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

      const lesson = { lessonID: tmp._id, items, notes: "",quiz:{passed:false,grade:0} };
      result.push(lesson);
    }

    return await Enrollment.create({
      course: course,
      trainee: trainee,
      lessons: result,
      totalDuration: totalDuration,
      myRating: { rating: 0, review: "" },
    });
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

  async submitQuiz(traineeId,courseId, lessonId, answers) {
    const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        const correctAnswers = lesson.quiz.map((q, index) => q.answer === answers[index]);
        const totalQuestions = lesson.quiz.length;
        const correctCount = correctAnswers.filter(Boolean).length;
        const percentage = (correctCount / totalQuestions) * 100;
        const points = totalQuestions * 5;

        const enrollment = await Enrollment.findOne({ course: courseId, trainee:traineeId });
        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        // Update the completed duration and quiz status
        const lessonIndex = enrollment.lessons.findIndex(l => l.lessonID.toString() === lessonId);
        if (lessonIndex === -1) {
            throw new Error('Lesson not found in enrollment');
        }
        enrollment.lessons[lessonIndex].quiz.passed = percentage >= 75;
        enrollment.lessons[lessonIndex].quiz.grade = percentage;
        if (enrollment.lessons[lessonIndex].quiz.passed) {
            enrollment.completedDuration += points;
        }
        enrollment.lessons[lessonIndex].quiz.answers=answers
        await enrollment.save();
        console.log(enrollment)
        return {
            passed: enrollment.lessons[lessonIndex].quiz.passed,
            percentage,
            completedDuration:enrollment.completedDuration,
            results: lesson.quiz.map((q, index) => (
                q.answer === answers[index]
            ))
        };

  }

  async getTraineeEnrollment(traineeId, courseId) {
    const enrollment = await Enrollment.findOne({
      trainee: traineeId,
      course: courseId,
    })
      .populate("course") // Populates the course details
      .exec();

    const lessons = await Lesson.find({ course: courseId }); // Fetch lessons separately

    return { enrollment, lessons };
  }

  async getTraineeEnrollmentsInfo(traineeId) {
    const enrollments = await Enrollment.find({ trainee: traineeId })
      .populate("course") // Populates the course details
      .exec();

    return enrollments;
  }
}

module.exports = new enrollmentService();
