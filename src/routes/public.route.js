const express = require("express");
const publicController = require("../controllers/public.controller");

const router = express.Router();

router.post("/signUp", publicController.signUp);
router.post("/signIn", publicController.signIn);

module.exports = router;
