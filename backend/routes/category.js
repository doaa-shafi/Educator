const express = require("express")
const {getCategories,addCategory} = require("../controllers/category")
const verifyJWT  = require("../middlewares/verifyJWT")


const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);

module.exports = router;






















