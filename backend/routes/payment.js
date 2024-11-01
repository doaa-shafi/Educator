const express = require("express")
const { getPaymentsByReceiverId} = require("../controllers/pyment")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/",verifyJWT, getPaymentsByReceiverId);


module.exports = router;






















