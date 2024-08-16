const express = require("express")
const verifyJWT  = require("../middlewares/verifyJWT");
const { registerToCourse } = require("../controllers/individualTrainee");


const router = express.Router();

router.patch("/register", verifyJWT, registerToCourse);

module.exports = router;






















