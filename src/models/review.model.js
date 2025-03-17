const { Schema, default: mongoose } = require("mongoose");
const reviewSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userName: { type: String, required: true },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Review", reviewSchema);
