import Tour from "../models/Tour.js";
import Destination from "../models/Destination.js";
import uploadFiles from "../utils/uploadTourPhoto.js"
import multer from 'multer';
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
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const { title, country, city, price, ageRange, duration } = req.body;
      if (!title || !country || !city || !price || !ageRange || !duration) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const newTour = new Tour({
        title,
        country,
        city,
        price,
        ageRange,
        duration,
        photo: req.file ? req.file.id : null,
      });

      await newTour.save();

      res.status(200).json({
        success: true,
        message: "Tour created",
        data: newTour,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

export const updateTour = async (req, res) => {
  const id = req.params.id;
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "File upload failed" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = req.file.id;
      console.log("🚀 ~ uploadFiles ~ updateData:", updateData)
    }
    
    try {
      const updatedTour = await Tour.findByIdAndUpdate(
        id,
        {
          $set: updateData,
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
        message: "Failed to update",
      });
    }
  });
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
export const getListTour = async (req, res) => {
  try {
    let { page, limit, status, search, searchType } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (search) {
      if (searchType === "Tour") {
        filter.title = { $regex: search, $options: "i" };
      } else if (searchType === "country") {
        filter.country = { $regex: search, $options: "i" };
      } 
      else if (searchType === "city") {
        filter.city = { $regex: search, $options: "i" };}
        else {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ];
      }
    }
    const totalCount = await Tour.countDocuments();
    const totalPages = (await Tour.countDocuments(filter)) / limit;
    const tours = await Tour.find(filter)
      .populate("reviews")
      .limit(limit)
      .skip((page - 1) * limit);
    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalPages),
      totalCount: totalCount,
      message: "Successfully fetched all tours",
      data: tours,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};
