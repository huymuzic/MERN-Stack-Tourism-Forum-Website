import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    primary: {
      type: String,
      required: true,
    },
    headerBgColor: {
      type: String,
    },
    headerTextColor: {
      type: String,
    },
    buttonHoverColor: {
      type: String,
    },
    buttonTextColor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);

export default Theme;
