const express = require("express")
const {getSignedInCorporate,getSignedInCorporateWithTrainees, addCorporate ,renew,registerToCourse} = require("../controllers/corporate")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/",verifyJWT, getSignedInCorporate);
router.get("/trainees",verifyJWT, getSignedInCorporateWithTrainees);

router.post("/", addCorporate);

router.patch("/courses",verifyJWT,registerToCourse)
router.patch("/renew", verifyJWT,renew);


module.exports = router;






















