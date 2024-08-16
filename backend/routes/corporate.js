const express = require("express")
const { addCorporate,addTrainees,createTeam,removeTrainees,assignCourseToTeam,removeCourseFromTeam,assignCourseToTrainee } = require("../controllers/corporate")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.post("/", addCorporate);
router.post('/:corporateId/teams',verifyJWT, createTeam);
router.post('/:corporateId/teams/:teamId/trainees',verifyJWT, addTrainees);
router.delete('/:corporateId/teams/:teamId/trainees',verifyJWT, removeTrainees);
router.post('/:corporateId/teams/:teamId/courses',verifyJWT, assignCourseToTeam);
router.delete('/:corporateId/teams/:teamId/courses',verifyJWT, removeCourseFromTeam);
router.post('/:corporateId/trainees/courses',verifyJWT, assignCourseToTrainee);

module.exports = router;






















