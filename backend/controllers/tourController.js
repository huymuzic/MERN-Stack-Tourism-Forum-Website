import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";

export const createDestination = async (req, res) => {
  const newDestination = new Destination(req.body);

  try {
    const savedDestination = await newDestination.save();

    res.status(200).json({
      success: true,
      message: "Successfully upload image url",
      data: savedDestination,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

export const createTour = async (req, res) => {
  const newTour = new Tour(req.body);

  try {
    const savedTour = await newTour.save();

    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

export const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to update",
    });
  }
};

export const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to delete",
    });
  }
};

export const getSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id).populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "avatar",
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully fetched single tour",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "failed to fetch single tour",
    });
  }
};

export const getAllTour = async (req, res) => {
  const page = parseInt(req.query.page);

  try {
    const tours = await Tour.find({})
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          select: "avatar",
        },
      })
      .skip(page * 8)
      .limit(8);

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Succesfully fetched all tours",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTourBySearch = async (req, res) => {
  let query = {};

  if (req.query.country) {
    query.country = new RegExp(req.query.country, "i");
  }
  if (req.query.city) {
    query.city = new RegExp(req.query.city, "i");
  }
  if (req.query.duration) {
    query.duration = { $gte: parseInt(req.query.duration) };
  }
  if (req.query.price) {
    query.price = { $lte: parseInt(req.query.price) };
  }

  try {
    const tours = await Tour.find(query).populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "avatar",
      },
    });

    res.status(200).json({
      success: true,
      message: "Successful",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          select: "avatar",
        },
      })
      .limit(8);

    res.status(200).json({
      success: true,
      message: "Succesfully fetched featured tours",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();

    res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTopDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});

    res.status(200).json({
      success: true,
      message: "Successfully fetched top destinations",
      data: destinations,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
