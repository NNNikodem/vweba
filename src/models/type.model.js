const crypto = require("crypto");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const typeSchema = new Schema(
  {
    type: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Type", typeSchema);
