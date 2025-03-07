const HttpError = require("./HttpError");

const checkValidation = (errors) => {
  if (!errors.isEmpty()) {
    const errMessage = errors
      .array()
      .map((item) => `${item.path} - ${item.msg}`)
      .join(",");
    throw new HttpError(errMessage, 400);
  }
};

module.exports = {
  checkValidation,
};
