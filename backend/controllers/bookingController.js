import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  const {
    userId,
    email,
    tourId,
    tourTitle,
    country,
    city,
    photo,
    date,
    price,
    numPeople,
  } = req.body;

  try {
    const newBooking = new Booking({
      userId,
      email,
      tourId,
      tourTitle,
      country,
      city,
      photo,
      date,
      price,
      numPeople,
    });

    await newBooking.save();

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBookingByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const booking = await Booking.findOne({ userId }).sort({ date: -1 });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "No booking found for this user" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllBookingByUserId = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const bookings = await Booking.find({ userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBookings = await Booking.countDocuments({ userId });
    const totalPages = Math.ceil(totalBookings / limit);

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json({ bookings, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// fetch all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      success: true,
      message: "Successfully fetched all bookings",
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
