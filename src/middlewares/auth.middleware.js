const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  if (req.url.startsWith("/public")) {
    return next();
  }
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ message: "Chyba overenia totoznosti." });
  }
  try {
    const decoded = jwt.verify(token, process.env.API_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Chyba overenia totoznosti." });
  }
};

module.exports = authMiddleware;
