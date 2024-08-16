const express = require("express");
const {requestSignUp,acceptInstructor,rejectInstructor,  addMiniBiography} = require("../controllers/instructor");

const verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();


router.post("/request", requestSignUp);

router.patch("/accept/:id", verifyJWT, acceptInstructor);

router.delete("/reject/:id", verifyJWT, rejectInstructor);

router.patch("/:id", verifyJWT, addMiniBiography);

module.exports = router;
