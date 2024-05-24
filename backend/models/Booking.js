import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  email: {
    type: String,
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
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  photo: {
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
});

const Booking =
  mongoose.model("Booking", bookingSchema) || mongoose.models.Booking;

export default Booking;
