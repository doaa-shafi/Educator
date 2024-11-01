const express = require("express")
const {getSignedInCorporate,getSignedInCorporateWithTeams,getSignedInCorporateWithTrainees, addCorporate } = require("../controllers/corporate")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/",verifyJWT, getSignedInCorporate);
router.get("/trainees",verifyJWT, getSignedInCorporateWithTrainees);
router.get("/teams",verifyJWT, getSignedInCorporateWithTeams);


router.post("/", addCorporate);


module.exports = router;






















