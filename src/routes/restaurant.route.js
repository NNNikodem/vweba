const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");

const router = express.Router();

router.get("/", restaurantController.get);
router.get("/user", restaurantController.getByUser);
router.post("/", restaurantController.create);
router.put("/:restId", restaurantController.edit);
router.delete("/:restId", restaurantController.remove);

module.exports = router;
