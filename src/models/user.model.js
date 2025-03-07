const BaseRepository = require("../../repositories/repository");
const crypto = require("crypto");

class UserRepository extends BaseRepository {
  async create(attrs) {
    const records = await this.getAll();
    const salt = crypto.randomBytes(16).toString("hex");
    const record = {
      ...attrs,
      salt,
      password: crypto
        .pbkdf2Sync(attrs.password, salt, 1000, 64, "sha512")
        .toString("hex"),
      id: this.randomId(),
    };
    records.push(record);
    await this.writeAll(records);
    return record;
  }
  checkPassword = (user, password) => {
    const hash_pwd = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
      .toString("hex");
    return user.password === hash_pwd;
  };
}

module.exports = new UserRepository("./users.json");
