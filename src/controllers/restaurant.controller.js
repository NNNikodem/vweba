const { body, validationResult, matchedData } = require("express-validator");
const restaurantModel = require("../models/restaurant.model");
const HttpError = require("../utils/HttpError");
const { checkValidation } = require("../utils/helpers");
const typeModel = require("../models/type.model");

const get = async (req, res) => {
  const records = await restaurantModel.find();
  res.send(records);
};
const getByUser = async (req, res) => {
  console.log(req.user);
  const records = await restaurantModel.find({ userId: req.user.userId });
  res.send(records);
};
const create = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Name should have at least 5 cahracters."),
  body("description")
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .withMessage("Description should have at least 10 cahracters."),
  body("typeId").not().isEmpty(),
  body("address.street")
    .not()
    .isEmpty()
    .withMessage("Street should not be empty."),
  body("address.number")
    .isNumeric()
    .not()
    .isEmpty()
    .withMessage("Building Number should not be empty."),
  body("address.city").not().isEmpty().withMessage("City should not be empty."),
  body("address.state")
    .not()
    .isEmpty()
    .withMessage("State should not be empty."),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { name, description, typeId, address } = req.body;
    const typeObj = await typeModel.findById(typeId);
    if (!typeObj) {
      throw new HttpError("Type not found!", 404);
    }
    const record = new restaurantModel({
      name,
      description,
      address,
      type: typeObj.type,
      typeId,
      userId: req.user.userId,
      userName: req.user.userName,
    });
    try {
      await record.save();
    } catch (error) {
      throw new HttpError("Database error: " + error.message, 500);
    }
    res.status(201).send({ record: record._id });
  },
];
const edit = [
  body("name")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Name should have at least 5 cahracters."),
  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description should have at least 10 characters."),
  body("type").optional(),
  body("address.street").optional(),
  body("address.number")
    .isNumeric()
    .optional()
    .withMessage("Address Number should be numeric."),
  body("address.city").optional(),
  body("address.state").optional(),
  async (req, res) => {
    checkValidation(validationResult(req));
    const matched = matchedData(req, {
      includeOptional: true,
      onlyValidData: true,
    });
    const record = await restaurantModel.findById(req.params.restId);
    if (!record) {
      throw new HttpError("Restaurant not found!", 404);
    }
    for (const key in matched) {
      if (matched[key] !== undefined) {
        if (key === "address") {
          for (const addressKey in matched[key]) {
            if (matched[key][addressKey] !== undefined) {
              record[key][addressKey] = matched[key][addressKey];
            }
            record.markModified("address");
          }
          continue;
        }
        record[key] = matched[key];
      }
    }
    try {
      await record.save();
    } catch (error) {
      return res
        .status(404)
        .send({ message: "Restaurant not found! " + error.message });
    }
    res.status(201).send({ message: "Restaurant updated successfully" });
  },
];
const remove = async (req, res) => {
  try {
    await restaurantModel.findByIdAndDelete(req.params.restId);
  } catch (error) {
    return res
      .status(404)
      .send({ message: "Restaurant not found! " + error.message });
  }
  res.status(201).send({ message: "Restaurant deleted successfully" });
};

module.exports = {
  get,
  getByUser,
  create,
  edit,
  remove,
};
