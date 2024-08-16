const express = require("express");
const {addCorporateTrainee} = require("../controllers/corporateTrainee");

const  verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/", verifyJWT, addCorporateTrainee);

module.exports = router;
