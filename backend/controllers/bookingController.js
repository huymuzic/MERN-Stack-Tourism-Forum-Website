import Booking from "../models/Booking.js";

// create new booking
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);

  try {
    const savedBooking = await newBooking.save();
    res.status(200).json({
      success: true,
      message: "Successfully booked",
      data: savedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// fetch bookings of a user
export const getBookings = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await Booking.findById(id);

    res.status(200).json({
      success: true,
      message: "Successfully fetched bookings",
      data: booking,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
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
