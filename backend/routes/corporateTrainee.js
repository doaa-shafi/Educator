const express = require("express");
const {getCorporateTrainee,addCorporateTrainee,removeCorporateTrainee,getTraineesByCorporate,getTraineesEmailsAndIdsByCorporate,assignCoursesToTrainees,removeCourseFromTrainee} = require("../controllers/corporateTrainee");

const  verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/", verifyJWT, addCorporateTrainee);

router.delete("/", verifyJWT, removeCorporateTrainee);

router.get("/emails",verifyJWT,getTraineesEmailsAndIdsByCorporate)
router.get("/:id", verifyJWT, getCorporateTrainee);
router.get("/", verifyJWT, getTraineesByCorporate);

router.patch('/',verifyJWT,assignCoursesToTrainees)
router.patch('/:traineeId/courses/:courseId',verifyJWT,removeCourseFromTrainee)

module.exports = router;
