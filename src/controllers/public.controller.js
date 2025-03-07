const { body, validationResult } = require("express-validator");
const { checkValidation } = require("../utils/helpers");
const userModel = require("../models/user.model");
const HttpError = require("../utils/HttpError");
const jwt = require("jsonwebtoken");

const signUp = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 4 })
    .withMessage("Je potrebné zadať meno."),
  body("email").isEmail().withMessage("Neplatný email"),
  body("password").not().isEmpty().withMessage("Heslo nemôže byť prázdne"),
  body("password_repeat")
    .not()
    .isEmpty()
    .withMessage("Heslo nemôže byť prázdne"),
  body("password")
    .matches(/[0-9]/)
    .withMessage("Heslo musí obsahovať aspoň jedno číslo"),
  body("password")
    .matches(/[a-z]/)
    .withMessage("Heslo musí obsahovať aspoň jeden malý znak"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Heslo musí obsahovať aspoň jeden veľký znak"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Heslo musí mať minimálne 8 znakov"),

  async (req, res) => {
    checkValidation(validationResult(req));
    const { name, email, password, password_repeat } = req.body;
    const existingUser = await userModel.getOneBy({ email });
    if (existingUser) {
      throw new HttpError("Tento email sa uz pouziva.", 400);
    }
    if (password !== password_repeat) {
      throw new HttpError("Hesla sa nezhoduju!", 400);
    }
    const record = await userModel.create({ name, email, password });
    res.status(201).send({ email: record.email });
  },
];
const signIn = [
  body("email").isEmail().withMessage("Neplatny email."),
  body("password").not().isEmpty().withMessage("Heslo nemoze byt prazdne!"),
  async (req, res) => {
    checkValidation(validationResult(req));
    const { email, password } = req.body;
    const existingUser = await userModel.getOneBy({ email });
    if (!existingUser) {
      throw new HttpError("Zle prihlasovacie udaje!", 400);
    }
    if (!userModel.checkPassword(existingUser, password)) {
      throw new HttpError("Zle prihlasovacie udaje!", 400);
    }
    const token = jwt.sign(
      {
        userId: existingUser.id,
        userName: existingUser.name,
      },
      process.env.API_KEY
    );
    res.send({ token });
  },
];

module.exports = {
  signUp,
  signIn,
};
