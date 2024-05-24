import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    tourId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tour",
      required: true,
    },
    tourTitle: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    numPeople: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;
