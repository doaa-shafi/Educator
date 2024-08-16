const express = require("express");
const {
  getCourseLessons,
  getCourseLessonsInfo,
  getLesson,
  getQuizAnswers,
  createLesson,
  addQuiz,
  addVideo,
  addLecture,
} = require("../controllers/lesson");
const{uploadLecture}=require('../middlewares/uploadPDF')

const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.get("/get-lessons", verifyJWT, getCourseLessons);
router.get("/get-lessons-info",getCourseLessonsInfo );
router.get("/get-lesson/:id", verifyJWT, getLesson);
router.get('/:lessonId/quiz',verifyJWT,getQuizAnswers);
router.post("/create-lesson", verifyJWT, createLesson);
router.patch("/add-video", verifyJWT, addVideo);
router.patch('/add-lecture',verifyJWT, uploadLecture.single('lectureFile'),addLecture);
router.patch("/add-quiz", verifyJWT, addQuiz);

module.exports = router;