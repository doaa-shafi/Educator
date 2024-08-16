const express = require("express");
const {
  addAdmin
} = require("../controllers/admin");

const verifyJWT  = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/", verifyJWT, addAdmin);


module.exports = router;
