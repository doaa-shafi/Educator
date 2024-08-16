const express = require("express");
const {
  getPopulerCoursesInfo,
  getCourse,
  getCourseInfo,
  createCourse,
  updateCourseInfo,
  updateCourselearnings,
  updateCourcePricing,
  uploadPreviewVideo,
  getDraftCourses,
  publishCourse
} = require("../controllers/course");

const verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();  

router.get("/populer", getPopulerCoursesInfo);
router.get("/draft",verifyJWT,getDraftCourses)
router.get("/about/:id", getCourseInfo);
router.get("/:id", getCourse);
router.post("/",verifyJWT,createCourse);
router.patch("/:id",verifyJWT,updateCourseInfo);
router.patch("/course-learning/:id",verifyJWT,updateCourselearnings)
router.patch("/course-pricing/:id",verifyJWT,updateCourcePricing)
router.patch("/course-video/:id",verifyJWT, uploadPreviewVideo);
router.patch("/publish",verifyJWT, publishCourse);





module.exports = router;
