const express = require("express");
const { signUp,login,refresh,logout } = require("../controllers/auth");

const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.post("/", login);

router.post("/logout", verifyJWT, logout);

router.get("/refresh", refresh);

router.post("/signup", signUp);

module.exports = router;
