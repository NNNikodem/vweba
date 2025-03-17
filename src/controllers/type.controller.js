const { body, validationResult, matchedData } = require("express-validator");
const typeModel = require("../models/type.model");
const { checkValidation } = require("../utils/helpers");
const HttpError = require("../utils/HttpError");
const restaurantModel = require("../models/restaurant.model");

const get = async (req, res) => {
  const types = await typeModel.find();
  res.send(types);
};

const create = [
  body("type").not().isEmpty().withMessage("Type cannot be empty"),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { type } = req.body;
    const typeObj = new typeModel({ type });
    try {
      await typeObj.save();
    } catch (error) {
      throw new HttpError(`Database error: ${error.message}`, 500);
    }
    res.status(201).send({ _id: typeObj._id });
  },
];
const edit = [
  body("type").not().isEmpty().withMessage("Type cannot be empty"),
  async (req, res) => {
    checkValidation(validationResult(req));
    const matched = matchedData(req, { onlyValidData: true });
    const typeObj = await typeModel.findById(req.params.typeId);
    if (!typeObj) {
      throw new HttpError("Type not found", 404);
    }
    Object.assign(typeObj, matched);
    try {
      const restaurants = await restaurantModel.find({ type: typeObj._id });
      for (const r of restaurants) {
        r.type = matched.type;
        await r.save();
      }
      await typeObj.save();
    } catch (error) {
      throw new HttpError(`Database error: ${error.message}`, 500);
    }
    res.send({ message: "Type updated" });
  },
];
const remove = async (req, res) => {
  try {
    await typeModel.findByIdAndDelete(req.params.typeId);
  } catch (error) {
    throw new HttpError(`Database error: ${error.message}`, 500);
  }
  res.send({ message: "Type removed" });
};

module.exports = {
  get,
  create,
  edit,
  remove,
};
