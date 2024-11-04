const express = require("express");
const {
  searchAndFilterCourses,
  getPopulerCoursesInfo,
  getCourse,
  getCourseInfo,
  getCalculatedPrice,
  createCourse,
  updateCourse,
  getDraftCourses,
  getDraftCourse,
  getClosedCourses,
  publishCourse,
  cloneCourseAsDraft,
  openClosedCourse
} = require("../controllers/course");

const verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();  

router.get("/", searchAndFilterCourses);
router.get("/populer", getPopulerCoursesInfo);
router.get("/draft",verifyJWT,getDraftCourses)
router.get("/draft/:id",verifyJWT,getDraftCourse)
router.get("/closed",verifyJWT,getClosedCourses)
router.get("/about/:id", getCourseInfo);
router.get("/price",verifyJWT,getCalculatedPrice)

router.get("/:id", getCourse);

router.post("/",verifyJWT,createCourse);
router.patch("/publish",verifyJWT, publishCourse);
router.patch("/:id",verifyJWT,updateCourse)
router.patch("/:id/clone",verifyJWT,cloneCourseAsDraft)
router.patch("/:id/open",verifyJWT,openClosedCourse)






module.exports = router;
