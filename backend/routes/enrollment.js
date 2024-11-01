const express = require("express");
const  verifyJWT  = require("../middlewares/verifyJWT");
const { addEnrollment,updateProgress ,submitQuiz,getTraineeEnrollment,getTraineeEnrollmentsInfo} = require("../controllers/enrollment");

const router = express.Router();

router.post("/", verifyJWT, addEnrollment);
router.patch("/", verifyJWT, updateProgress);
router.get('/about',verifyJWT,getTraineeEnrollmentsInfo)
router.get('/:id',verifyJWT,getTraineeEnrollment)
router.patch('/submit-quiz',verifyJWT, submitQuiz);

module.exports = router;
