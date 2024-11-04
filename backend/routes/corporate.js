const express = require("express")
const {getSignedInCorporate,getSignedInCorporateWithTrainees, addCorporate ,registerToCourse} = require("../controllers/corporate")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/",verifyJWT, getSignedInCorporate);
router.get("/trainees",verifyJWT, getSignedInCorporateWithTrainees);

router.post("/", addCorporate);

router.patch("/courses",verifyJWT,registerToCourse)


module.exports = router;






















