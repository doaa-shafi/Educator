const express = require("express")
const {getTeamById, addTeam, addTraineesToTeam,removeTraineesFromTeam,assignCourseToTeam,removeCourseFromTeam } = require("../controllers/team")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/:id",verifyJWT, getTeamById);

router.post('/',verifyJWT, addTeam);
router.post('/:teamId/trainees',verifyJWT, addTraineesToTeam);
router.post('/:teamId/courses/:courseId',verifyJWT, assignCourseToTeam);

router.delete(':teamId/trainees',verifyJWT, removeTraineesFromTeam);
router.delete('/:teamId/courses',verifyJWT, removeCourseFromTeam);


module.exports = router;






















