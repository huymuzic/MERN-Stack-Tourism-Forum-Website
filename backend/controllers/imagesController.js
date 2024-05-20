import Images from "../models/Images.js";

export const createImages = async (req, res) => {
  const newImage = new Images(req.body);

  try {
    const savedImage = await newImage.save();

    res.status(200).json({
      success: true,
      message: "Successfully upload image url",
      data: savedImage,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to upload. Try again" });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Images.find({});

    res.status(200).json({
      success: true,
      message: "Succesfully fetched all images",
      data: images,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
