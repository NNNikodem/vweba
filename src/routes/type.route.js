const express = require("express");
const typeController = require("../controllers/type.controller");

const router = express.Router();

router.get("/", typeController.get);
router.post("/", typeController.create);
router.put("/:typeId", typeController.edit);
router.delete("/:typeId", typeController.remove);

module.exports = router;
