const { body, validationResult, matchedData } = require("express-validator");
const restaurants = require("../../repositories/restaurants");
const HttpError = require("../utils/HttpError");
const { checkValidation } = require("../utils/helpers");

const get = async (req, res) => {
  const records = await restaurants.getAll();
  console.log(req.user);
  res.send(records);
};
const create = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Name should have at least 5 cahracters."),
  body("decription")
    .not()
    .isEmpty()
    .isLength({ min: 10 })
    .withMessage("Description should have at least 10 cahracters."),
  body("type").not().isEmpty().withMessage("Type should not be empty."),
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
    const record = await restaurants.create(req.body);

    res.status(201).send(record);
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
      onlyValidData: true,
    });
    try {
      await restaurants.update(req.params.restId, matched);
    } catch (error) {
      return res
        .status(404)
        .send({ message: "Restaurant not found! " + error.message });
    }
    res.send({});
  },
];
const remove = async (req, res) => {
  const record = await restaurants.getOne(req.params.restId);
  if (!record) {
    //return res.status(404).send({message:"Restaurant not found!"});
    throw new HttpError("Restaurant not found!", 404);
  }
  await restaurants.delete(req.params.restId);
  res.send({});
};

module.exports = {
  get,
  create,
  edit,
  remove,
};
