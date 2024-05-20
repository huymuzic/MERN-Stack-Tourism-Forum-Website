import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const Images = mongoose.model("Images", imagesSchema);

export default Images;
