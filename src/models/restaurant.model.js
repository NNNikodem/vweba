const { Schema, default: mongoose } = require("mongoose");
const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    typeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Type",
      required: true,
    },
    userName: { type: String, required: true },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: Object },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Restaurant", restaurantSchema);
