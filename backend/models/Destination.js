import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
