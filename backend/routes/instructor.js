const express = require("express");
const {
  requestSignUp,
  acceptInstructor,
  rejectInstructor,
  getSignedInInstructor,
  getInstuctor,
  updateInstuctor,
  uploadInstructorImage
} = require("../controllers/instructor");

const verifyJWT = require("../middlewares/verifyJWT");
const { uploadCV ,uploadInstructorPhoto} = require("../middlewares/uploadPDF");

const router = express.Router();

router.post("/request",uploadCV.single('cvFile'), requestSignUp);

router.patch("/accept/:id", verifyJWT, acceptInstructor);

router.delete("/reject/:id", verifyJWT, rejectInstructor);

router.get("/", verifyJWT, getSignedInInstructor);

router.get("/:id",getInstuctor)

router.patch("/", verifyJWT, updateInstuctor);

router.patch("/upload-image",verifyJWT,uploadInstructorPhoto.single('image'), uploadInstructorImage);

module.exports = router;
